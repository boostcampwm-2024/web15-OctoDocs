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
import { NodeService } from '../node/node.service';
import { PageService } from '../page/page.service';
import {
  yXmlFragmentToProsemirrorJSON,
  prosemirrorJSONToYXmlFragment,
} from 'y-prosemirror';
import { novelEditorSchema } from './yjs.schema';
import { EdgeService } from '../edge/edge.service';
import { Node } from '../node/node.entity';
import { Edge } from '../edge/edge.entity';
import { YMapEdge } from './yjs.type';
import { RedisService } from '../redis/redis.service';
import { PageNotFoundException } from '../exception/page.exception';

// Y.Doc에는 name 컬럼이 없어서 생성했습니다.
class CustomDoc extends Y.Doc {
  name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }
}

@WebSocketGateway(1234)
export class YjsService
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger(YjsService.name);
  private ysocketio: YSocketIO;

  constructor(
    private readonly nodeService: NodeService,
    private readonly pageService: PageService,
    private readonly edgeService: EdgeService,
    private readonly redisService: RedisService,
  ) {}

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

      // document name이 flow-room이라면 모든 노드들을 볼 수 있는 화면입니다.
      // 노드를 클릭해 페이지를 열었을 때만 해당 페이지 값을 가져와서 초기 데이터로 세팅해줍니다.
      if (customDoc.name?.startsWith('document-')) {
        const pageId = parseInt(customDoc.name.split('-')[1]);

        // 초기 세팅할 page content
        let pageContent: JSON;
        try {
          const findPage = await this.pageService.findPageById(pageId);
          pageContent = JSON.parse(JSON.stringify(findPage.content));
        } catch (exception) {
          // 에러 스택 출력
          this.logger.error(exception.stack);

          // 만약 존재하지 않는 페이지에 접근한다면 비어있는 content를 전달한다.
          if (exception instanceof PageNotFoundException) {
            pageContent = JSON.parse('{}');
            return;
          }

          throw exception;
        }

        // content가 비어있다면 내부 구조가 novel editor schema를 따르지 않기 때문에 오류가 납니다.
        // content가 존재할 때만 넣어줍니다.
        // const pageContent = JSON.parse(JSON.stringify(findPage.content));
        // const novelEditorContent = {
        //   type: 'doc',
        //   content: pageContent,
        // };

        if (Object.keys(pageContent).length > 0) {
          this.transformText(pageContent);
          // this.logger.error(this.transformText(pageContent));
          this.initializePageContent(pageContent, editorDoc);
        }
        // JSON.parse(findPage.content).length > 0 &&

        // 페이지 내용 변경 사항을 감지해서 데이터베이스에 갱신합니다.
        editorDoc.observeDeep(() => {
          const document = editorDoc.doc as CustomDoc;
          const pageId = parseInt(document.name.split('-')[1]);
          // this.pageService.updatePage(
          //   pageId,
          //   JSON.parse(
          //     JSON.stringify(yXmlFragmentToProsemirrorJSON(editorDoc)),
          //   ),
          // );

          this.redisService.setField(
            `page:${pageId.toString()}`,
            'content',
            JSON.stringify(yXmlFragmentToProsemirrorJSON(editorDoc)),
          );
          // this.redisService.get(pageId.toString()).then((data) => {
          //   console.log(data);
          // });
        });
        return;
      }

      // 만약 페이지가 아닌 모든 노드들을 볼 수 있는 document라면 node, edge 초기 데이터를 세팅해줍니다.
      // node, edge, page content 가져오기

      // TODO: 서비스 함수 workspaceId 입력해야하도록 수정되었습니다!!

      if (!customDoc.name?.startsWith('flow-room-')) {
        return;
      }

      // const workspaceId = customDoc.name.split('-')[2];
      // console.log('======', workspaceId);
      const workspaceId = 'main';
      const nodes = await this.nodeService.findNodesByWorkspace(workspaceId);
      const edges = await this.edgeService.findEdgesByWorkspace(workspaceId);
      const nodesMap = doc.getMap('nodes');
      const title = doc.getMap('title');
      const emoji = doc.getMap('emoji');
      const edgesMap = doc.getMap('edges');

      this.initializeYNodeMap(nodes, nodesMap, title, emoji);
      this.initializeYEdgeMap(edges, edgesMap);

      // title의 변경 사항을 감지한다.
      title.observeDeep(async (event) => {
        // path가 존재할 때만 페이지 갱신

        event[0].path.toString().split('_')[1] &&
          // this.pageService.updatePage(
          //   parseInt(event[0].path.toString().split('_')[1]),
          //   {
          //     title: event[0].target.toString(),
          //   },
          // );
          this.redisService.setField(
            `page:${event[0].path.toString().split('_')[1]}`,
            'title',
            event[0].target.toString(),
          );
      });
      emoji.observeDeep((event) => {
        // path가 존재할 때만 페이지 갱신
        event[0].path.toString().split('_')[1] &&
          this.pageService.updatePage(
            parseInt(event[0].path.toString().split('_')[1]),
            {
              emoji: event[0].target.toString(),
            },
          );
      });
      // node의 변경 사항을 감지한다.
      nodesMap.observe(async (event) => {
        for (const [key, change] of event.changes.keys) {
          if (change.action === 'update') {
            const node: any = nodesMap.get(key);
            if (node.type !== 'note') {
              continue;
            }

            // node.data는 페이지에 대한 정보
            const { title, id } = node.data;
            const { x, y } = node.position;
            const isHolding = node.isHolding;
            if (!isHolding) {
              // TODO : node의 경우 key 값을 page id가 아닌 node id로 변경
              const findPage = await this.pageService.findPageById(id);
              await this.nodeService.updateNode(findPage.node.id, {
                title,
                x,
                y,
              });
            }
          }
        }
      });

      // edge의 변경 사항을 감지한다.
      edgesMap.observe(async (event) => {
        for (const [key, change] of event.changes.keys) {
          if (change.action === 'add') {
            const edge = edgesMap.get(key) as YMapEdge;
            const findEdge = await this.edgeService.findEdgeByFromNodeAndToNode(
              parseInt(edge.source),
              parseInt(edge.target),
            );
            // 연결된 노드가 없을 때만 edge 생성
            if (!findEdge) {
              await this.edgeService.createEdge({
                fromNode: parseInt(edge.source),
                toNode: parseInt(edge.target),
              });
            }
          }
        }
      });
    });
  }

  // YMap에 노드 정보를 넣어준다.
  initializeYNodeMap(
    nodes: Node[],
    yNodeMap: Y.Map<unknown>,
    yTitleMap: Y.Map<unknown>,
    yEmojiMap: Y.Map<unknown>,
  ): void {
    // 초기화
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

  // yMap에 edge 정보를 넣어준다.
  initializeYEdgeMap(edges: Edge[], yMap: Y.Map<unknown>): void {
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

  // yXmlFragment에 content를 넣어준다.
  initializePageContent(content: JSON, yXmlFragment: Y.XmlFragment) {
    prosemirrorJSONToYXmlFragment(novelEditorSchema, content, yXmlFragment);
  }

  handleConnection() {
    this.logger.log('접속');
  }

  // editor에서 paragraph 내부 text 노드의 text 값의 빈 문자열을 제거한다.
  // text 값이 빈 문자열이면 empty text nodes are not allowed 에러가 발생합니다.
  transformText(doc: any) {
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
  handleDisconnect() {
    this.logger.log('접속 해제');
  }
}
