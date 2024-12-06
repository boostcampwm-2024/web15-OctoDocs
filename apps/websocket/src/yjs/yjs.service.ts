import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { YSocketIO } from 'y-socket.io/dist/server';
import * as Y from 'yjs';
import {
  yXmlFragmentToProsemirrorJSON,
  prosemirrorJSONToYXmlFragment,
} from 'y-prosemirror';
import { novelEditorSchema } from './yjs.schema';
import { YMapEdge } from './yjs.type';
import type { Node } from './types/node.entity';
import type { Edge } from './types/edge.entity';
import { RedisService } from '../redis/redis.service';
import axios from 'axios';

// Y.Doc에는 name 컬럼이 없어서 생성했습니다.
class CustomDoc extends Y.Doc {
  name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }
}

@WebSocketGateway()
export class YjsService
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger(YjsService.name);
  private ysocketio: YSocketIO;

  constructor(private readonly redisService: RedisService) {}

  @WebSocketServer()
  server: Server;

  afterInit() {
    if (!this.server) {
      this.logger.error('서버 초기화 안됨..!');
      this.server = new Server();
    }

    this.ysocketio = new YSocketIO(this.server, {
      gcEnabled: true,
    });

    this.ysocketio.initialize();

    this.ysocketio.on('document-loaded', async (doc: Y.Doc) => {
      // Y.Doc에 name이 없어서 새로 만든 CustomDoc
      const editorDoc = doc.getXmlFragment('default');
      const customDoc = editorDoc.doc as CustomDoc;

      // 만약 users document라면 초기화하지 않습니다.
      if (customDoc.name === 'users') {
        return;
      }

      // document name이 flow-room이라면 모든 노드들을 볼 수 있는 화면입니다.
      // 노드를 클릭해 페이지를 열었을 때만 해당 페이지 값을 가져와서 초기 데이터로 세팅해줍니다.
      if (customDoc.name?.startsWith('document-')) {
        const pageId = parseInt(customDoc.name.split('-')[1]);
        this.initializePage(pageId, editorDoc);
      }

      if (customDoc.name?.startsWith('flow-room-')) {
        const workspaceId = customDoc.name.split('-')[2] ?? 'main';
        // 만약 workspace document라면 node, edge 초기 데이터를 세팅해줍니다.
        this.initializeWorkspace(workspaceId, doc);
      }
    });
  }

  /**
   * yXmlFragment에 content를 넣어준다.
   */
  private async initializePage(pageId: number, editorDoc: Y.XmlFragment) {
    try {
      // 초기 세팅할 page content
      const response = await axios.get(
        `http://backend:3000/api/page/${pageId}`,
      );
      const findPage = response.data.page;
      const pageContent = JSON.parse(JSON.stringify(findPage.content));

      // content가 비어있다면 내부 구조가 novel editor schema를 따르지 않기 때문에 오류가 납니다.
      // content가 존재할 때만 넣어줍니다.
      if (Object.keys(pageContent).length > 0) {
        this.transformText(pageContent);
        prosemirrorJSONToYXmlFragment(
          novelEditorSchema,
          pageContent,
          editorDoc,
        );
      }

      // 페이지 내용 변경 사항을 감지해서 데이터베이스에 갱신합니다.
      editorDoc.observeDeep(() => {
        this.observeEditor(editorDoc);
      });
    } catch (error) {
      this.logger.error(
        `페이지 초기화 중 오류 발생 (pageId: ${pageId}): ${error.message}`,
      );
    }
  }

  handleConnection() {
    this.logger.log('접속');
  }

  handleDisconnect() {
    this.logger.log('접속 해제');
  }

  /**
   * initialize 관련 메소드
   */
  private async initializeWorkspace(workspaceId: string, doc: Y.Doc) {
    try {
      // workspaceId에 속한 모든 노드와 엣지를 가져온다.
      const [nodeResponse, edgeResponse] = await Promise.all([
        axios.get(`http://backend:3000/api/node/workspace/${workspaceId}`),
        axios.get(`http://backend:3000/api/edge/workspace/${workspaceId}`),
      ]);

      if (nodeResponse.status === 404 || edgeResponse.status === 404) {
        throw new Error('워크스페이스가 존재하지 않습니다.');
      }

      const nodes = nodeResponse.data.nodes;
      const edges = edgeResponse.data.edges;

      const nodesMap = doc.getMap('nodes');
      const title = doc.getMap('title');
      const emoji = doc.getMap('emoji');
      const edgesMap = doc.getMap('edges');

      this.initializeYNodeMap(nodes, nodesMap, title, emoji);
      this.initializeYEdgeMap(edges, edgesMap);

      // title의 변경 사항을 감지한다.
      title.observeDeep(this.observeTitle.bind(this));

      // emoji의 변경 사항을 감지한다.
      emoji.observeDeep(this.observeEmoji.bind(this));

      // node의 변경 사항을 감지한다.
      nodesMap.observe((event) => {
        this.observeNodeMap(event, nodesMap);
      });

      // edge의 변경 사항을 감지한다.
      edgesMap.observe(async (event) => {
        this.observeEdgeMap(event, edgesMap);
      });
    } catch (error) {
      this.logger.error(
        `워크스페이스 초기화 중 오류 발생 (workspaceId: ${workspaceId}): ${error.message}`,
      );
    }
  }

  /**
   * YMap에 노드 정보를 넣어준다.
   */
  private initializeYNodeMap(
    nodes: Node[],
    yNodeMap: Y.Map<unknown>,
    yTitleMap: Y.Map<unknown>,
    yEmojiMap: Y.Map<unknown>,
  ): void {
    // Y.Map 초기화
    yNodeMap.clear();
    yTitleMap.clear();
    yEmojiMap.clear();

    nodes.forEach((node) => {
      const nodeId = node.id.toString(); // id를 string으로 변환

      // Y.Map에 데이터를 삽입
      yNodeMap.set(nodeId, {
        id: nodeId,
        type: 'note',
        data: {
          title: node.page.title,
          id: node.page.id,
          emoji: node.page.emoji,
          color: node.color,
        },
        position: {
          x: node.x,
          y: node.y,
        },
        selected: false, // 기본적으로 선택되지 않음
        dragging: true,
        isHolding: false,
      });

      // Y.Text title에 데이터 삽입
      const pageId = node.page.id.toString(); // id를 string으로 변환
      const yTitleText = new Y.Text();
      yTitleText.insert(0, node.page.title);

      // Y.Map에 데이터를 삽입
      yTitleMap.set(`title_${pageId}`, yTitleText);

      // Y.Text emoji에 데이터 삽입
      const yEmojiText = new Y.Text();
      const emoji = node.page.emoji ?? '📄';
      yEmojiText.insert(0, emoji);

      // Y.Map에 데이터를 삽입
      yEmojiMap.set(`emoji_${pageId}`, yEmojiText);
    });
  }

  /**
   * yMap에 edge 정보를 넣어준다.
   */
  private initializeYEdgeMap(edges: Edge[], yMap: Y.Map<unknown>): void {
    edges.forEach((edge) => {
      const edgeId = edge.id.toString(); // id를 string으로 변환

      // Y.Map에 데이터를 삽입
      yMap.set(`e${edge.fromNode.id}-${edge.toNode.id}`, {
        id: edgeId,
        source: edge.fromNode.id.toString(),
        target: edge.toNode.id.toString(),
        sourceHandle: 'left',
        targetHandle: 'left',
      });
    });
  }

  /**
   * event listener 관련
   */
  private async observeTitle(event: Y.YEvent<any>[]) {
    // path가 존재할 때만 페이지 갱신
    event[0].path.toString().split('_')[1] &&
      this.redisService.setField(
        `page:${event[0].path.toString().split('_')[1]}`,
        'title',
        event[0].target.toString(),
      );
  }

  private async observeEmoji(event: Y.YEvent<any>[]) {
    // path가 존재할 때만 페이지 갱신
    event[0].path.toString().split('_')[1] &&
      this.redisService.setField(
        `page:${event[0].path.toString().split('_')[1]}`,
        'emoji',
        event[0].target.toString(),
      );
  }

  private async observeNodeMap(
    event: Y.YMapEvent<unknown>,
    nodesMap: Y.Map<unknown>,
  ) {
    try {
      for (const [key, change] of event.changes.keys) {
        if (change.action !== 'update') continue;

        const node: any = nodesMap.get(key);
        if (node.type !== 'note') continue;

        const { id, color } = node.data;
        const { x, y } = node.position;
        const isHolding = node.isHolding;

        if (isHolding) continue;

        try {
          const pageResponse = await axios.get(
            `http://backend:3000/api/page/${id}`,
          );

          const findPage = pageResponse.data.page;

          await Promise.all([
            this.redisService.setField(`node:${findPage.node.id}`, 'x', x),
            this.redisService.setField(`node:${findPage.node.id}`, 'y', y),
            this.redisService.setField(
              `node:${findPage.node.id}`,
              'color',
              color,
            ),
          ]);
        } catch (error) {
          this.logger.error(
            `노드 업데이트 중 오류 발생 (nodeId: ${id}): ${error.message}`,
          );
          continue;
        }
      }
    } catch (error) {
      this.logger.error(`노드맵 관찰 중 오류 발생: ${error.message}`);
    }
  }

  private async observeEdgeMap(
    event: Y.YMapEvent<unknown>,
    edgesMap: Y.Map<unknown>,
  ) {
    for (const [key, change] of event.changes.keys) {
      const [fromNode, toNode] = key.slice(1).split('-');
      const edge = edgesMap.get(key) as YMapEdge;

      if (change.action === 'add') {
        // 연결된 노드가 없을 때만 edge 생성
        this.redisService.setField(
          `edge:${edge.source}-${edge.target}`,
          'fromNode',
          edge.source,
        );
        this.redisService.setField(
          `edge:${edge.source}-${edge.target}`,
          'toNode',
          edge.target,
        );
        this.redisService.setField(
          `edge:${edge.source}-${edge.target}`,
          'type',
          'add',
        );
      }
      if (change.action === 'delete') {
        // 엣지가 존재하면 삭제
        this.redisService.setField(
          `edge:${fromNode}-${toNode}`,
          'fromNode',
          fromNode,
        );
        this.redisService.setField(
          `edge:${fromNode}-${toNode}`,
          'toNode',
          toNode,
        );
        this.redisService.setField(
          `edge:${fromNode}-${toNode}`,
          'type',
          'delete',
        );
      }
    }
  }

  private async observeEditor(editorDoc: Y.XmlFragment) {
    const document = editorDoc.doc as CustomDoc;
    try {
      const pageId = parseInt(document.name.split('-')[1]);

      await this.redisService.setField(
        `page:${pageId.toString()}`,
        'content',
        JSON.stringify(yXmlFragmentToProsemirrorJSON(editorDoc)),
      );
    } catch (error) {
      this.logger.error(
        `에디터 내용 저장 중 오류 발생 (pageId: ${document?.name}): ${error.message}`,
      );
    }
  }

  /**
   * editor에서 paragraph 내부 text 노드의 text 값의 빈 문자열을 제거한다.
   *text 값이 빈 문자열이면 empty text nodes are not allowed 에러가 발생합니다.
   */
  private transformText(doc: any) {
    doc.content.forEach((paragraph) => {
      if (paragraph.type === 'paragraph' && Array.isArray(paragraph.content)) {
        paragraph.content.forEach((textNode) => {
          if (textNode.type === 'text' && textNode.text === '') {
            textNode.text = ' '; // 빈 문자열을 공백으로 대체
          }
        });
      }
    });
  }
}
