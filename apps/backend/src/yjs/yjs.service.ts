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
import { yXmlFragmentToProsemirrorJSON } from 'y-prosemirror';
import { EdgeService } from '../edge/edge.service';
// yMap에 저장되는 Node 형태
type YMapNode = {
  id: string; // 노드 아이디
  type: string; // 노드의 유형
  data: {
    title: string; // 제목
    id: number; // 페이지 아이디
  };
  position: {
    x: number; // X 좌표
    y: number; // Y 좌표
  };
  selected: boolean;
};

// yMap에 저장되는 edge 형태
type YMapEdge = {
  id: string; // Edge 아이디
  source: string; // 출발 노드 아이디
  target: string; // 도착 노드 아이디
  sourceHandle: string;
  targetHandle: string;
};

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

  afterInit() {
    if (!this.server) {
      this.logger.error('서버 초기화 안됨..!');
      this.server = new Server();
    }

    this.ysocketio = new YSocketIO(this.server, {
      gcEnabled: true,
    });

    this.ysocketio.initialize();

    this.ysocketio.on('document-loaded', (doc: Y.Doc) => {
      const nodes = doc.getMap('nodes');
      const edges = doc.getMap('edges');
      const editorDoc = doc.getXmlFragment('default');

      // page content의 변경 사항을 감지한다.
      editorDoc.observeDeep(() => {
        const document = editorDoc.doc as CustomDoc;
        const pageId = parseInt(document.name.split('-')[1]);
        this.pageService.updatePage(
          pageId,
          JSON.parse(JSON.stringify(yXmlFragmentToProsemirrorJSON(editorDoc))),
        );
      });

      // node의 변경 사항을 감지한다.
      nodes.observe(() => {
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
      edges.observe(() => {
        const edges = Object.values(doc.getMap('edges').toJSON());
        edges.forEach(async (edge: YMapEdge) => {
          console.log(edge);
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

  handleConnection() {
    this.logger.log('접속');
  }

  handleDisconnect() {
    this.logger.log('접속 해제');
  }
}
