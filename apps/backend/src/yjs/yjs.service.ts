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

@WebSocketGateway(1234)
export class YjsService
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('YjsGateway');
  private ysocketio: YSocketIO;

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
      this.logger.log(`Document loaded: ${doc.guid}`);

      const titleMap = doc.getMap('title');
      titleMap.observe(() => {
        console.log(titleMap.toString());
      });
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
