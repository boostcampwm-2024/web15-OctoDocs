import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Injectable, Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { YSocketIO } from 'y-socket.io/dist/server';
import * as Y from 'yjs';
import { NodeService } from '../node/node.service';

@WebSocketGateway(1234)
export class YjsService
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('YjsGateway');
  private ysocketio: YSocketIO;

  constructor(private readonly nodeService: NodeService) {}
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

    this.ysocketio.on('document-update', (doc: Y.Doc) => {
      // console.log(doc.get("content").doc.share.get("content"));
      // console.log(doc.share.get('default'));
    });

    this.ysocketio.on('document-loaded', (doc: Y.Doc) => {
      doc.on('update', (update) => {
        // console.log(Y.decodeUpdate(update).structs);
        // console.log(doc.share.get('default'));
        const nodes = Object.values(doc.getMap('nodes').toJSON());
        console.log(nodes);
        nodes.forEach((node) => {
          const { title, id } = node.data;
          const { x, y } = node.position;
          console.log(title, id, x, y);
          this.nodeService.updateNode(id, { title, x, y });
        });
      });
      this.logger.log(`Document loaded: ${doc.guid}`);
      setTimeout(() => {
        const titleMap = doc.getMap('title');
        titleMap.observe(() => {
          console.log(titleMap.toString());
        });
      }, 5000);
      // const toggleMap = doc.getMap('toggleMap');
      // toggleMap.observe(() => {
      //   const toggleState = toggleMap.get('toggle') || false;
      //   this.logger.log('🐰 토글 상태 변경', {
      //     toggleState,
      //   });
      // });
    });
  }

  handleConnection() {
    this.logger.log('접속');
  }

  handleDisconnect() {
    this.logger.log('접속 해제');
  }
}
