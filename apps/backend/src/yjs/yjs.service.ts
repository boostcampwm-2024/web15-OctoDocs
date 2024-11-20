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
import { NodeCacheService } from '../node-cache/node-cache.service';
import {
  yXmlFragmentToProsemirrorJSON,
  prosemirrorJSONToYXmlFragment,
  prosemirrorJSONToYDoc,
  yDocToProsemirrorJSON,
} from 'y-prosemirror';
import { novelEditorSchema } from './yjs.schema';
import { Schema } from 'prosemirror-model';
import { EdgeService } from '../edge/edge.service';
import { Node } from 'src/node/node.entity';
import { Edge } from 'src/edge/edge.entity';
import { YMapEdge } from './yjs.type';
import { YMapNode } from './yjs.type';

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
  private logger = new Logger('YjsGateway');
  private ysocketio: YSocketIO;

  constructor(
    private readonly nodeService: NodeService,
    private readonly pageService: PageService,
    private readonly edgeService: EdgeService,
    private readonly nodeCacheService: NodeCacheService,
  ) {}
  @WebSocketServer()
  server: Server;
  insertProseMirrorDataToXmlFragment(xmlFragment: Y.XmlFragment, data: any[]) {
    // XML Fragment 초기화
    xmlFragment.delete(0, xmlFragment.length);

    // 데이터를 순회하면서 추가
    data.forEach((nodeData) => {
      const yNode = new Y.XmlElement(nodeData.type);

      if (nodeData.content) {
        nodeData.content.forEach((child) => {
          if (child.type === 'text') {
            const yText = new Y.XmlText();
            yText.insert(0, child.text);
            yNode.push([yText]);
          }
        });
      }

      xmlFragment.push([yNode]);
    });
  }
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
        const findPage = await this.pageService.findPageById(pageId);

        // content가 비어있다면 내부 구조가 novel editor schema를 따르지 않기 때문에 오류가 납니다.
        // content가 존재할 때만 넣어줍니다.
        const pageContent = JSON.parse(JSON.stringify(findPage.content));
        const novelEditorContent = {
          type: 'doc',
          content: pageContent,
        };
        pageContent.length > 0 &&
          // JSON.parse(findPage.content).length > 0 &&
          this.initializePageContent(novelEditorContent, editorDoc);

        // 페이지 내용 변경 사항을 감지해서 데이터베이스에 갱신합니다.
        editorDoc.observeDeep(() => {
          const document = editorDoc.doc as CustomDoc;
          const pageId = parseInt(document.name.split('-')[1]);
          this.pageService.updatePage(
            pageId,
            JSON.parse(
              JSON.stringify(yXmlFragmentToProsemirrorJSON(editorDoc)),
            ),
          );
        });
        return;
      }

      // 만약 페이지가 아닌 모든 노드들을 볼 수 있는 document라면 node, edge 초기 데이터를 세팅해줍니다.
      // node, edge, page content 가져오기
      const nodes = await this.nodeService.findNodes();
      const edges = await this.edgeService.findEdges();
      const nodesMap = doc.getMap('nodes');
      const edgesMap = doc.getMap('edges');

      this.initializeYNodeMap(nodes, nodesMap);
      this.initializeYEdgeMap(edges, edgesMap);

      // node의 변경 사항을 감지한다.
      nodesMap.observe(() => {
        const nodes = Object.values(doc.getMap('nodes').toJSON());

        // 모든 노드에 대해 검사한다.
        nodes.forEach((node: YMapNode) => {
          const { title, id } = node.data;
          const { x, y } = node.position;
          // 만약 캐쉬에 노드가 존재하지 않다면 갱신 후 캐쉬에 노드를 넣는다.
          if (!this.nodeCacheService.has(id)) {
            this.nodeService.updateNode(id, { title, x, y });
            this.nodeCacheService.set(id, title);
            return;
          }

          // 만약 캐쉬에 노드가 존재하고 title이 다르다면 갱신한다.
          if (!this.nodeCacheService.hasSameTitle(id, title)) {
            this.nodeService.updateNode(id, { title, x, y });
            this.nodeCacheService.set(id, title);
            return;
          }
          // 만약 캐쉬에 노드가 존재하고 title이 동일하다면 패스한다.
        });
      });
      // edge의 변경 사항을 감지한다.
      edgesMap.observe(() => {
        const edges = Object.values(doc.getMap('edges').toJSON());
        edges.forEach(async (edge: YMapEdge) => {
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
        });
      });
    });
  }

  // YMap에 노드 정보를 넣어준다.
  initializeYNodeMap(nodes: Node[], yMap: Y.Map<Object>): void {
    nodes.forEach((node) => {
      const nodeId = node.id.toString(); // id를 string으로 변환

      // Y.Map에 데이터를 삽입
      yMap.set(nodeId, {
        id: nodeId,
        type: 'note',
        data: {
          title: node.page.title,
          id: node.page.id,
        },
        position: {
          x: node.x,
          y: node.y,
        },
        selected: false, // 기본적으로 선택되지 않음
        dragging: true,
      });
    });
  }

  // yMap에 edge 정보를 넣어준다.
  initializeYEdgeMap(edges: Edge[], yMap: Y.Map<Object>): void {
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
  initializePageContent(content: Object, yXmlFragment: Y.XmlFragment) {
    prosemirrorJSONToYXmlFragment(novelEditorSchema, content, yXmlFragment);
  }
  handleConnection() {
    this.logger.log('접속');
  }

  handleDisconnect() {
    this.logger.log('접속 해제');
  }
}
