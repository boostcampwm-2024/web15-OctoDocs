import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as WebSocket from 'ws';
import { setupWSConnection } from 'y-websocket/bin/utils';

@Injectable()
export class YjsService implements OnModuleInit {
  private wss: WebSocket.Server;
  private logger = new Logger('YjsService');

  onModuleInit() {
    this.wss = new WebSocket.Server({ port: 1234 });

    this.wss.on('connection', (ws: WebSocket, req: any) => {
      this.logger.log('Client connected');
      setupWSConnection(ws, req);
    });

    this.logger.log('WebSocket server initialized on port 1234');
  }
}
