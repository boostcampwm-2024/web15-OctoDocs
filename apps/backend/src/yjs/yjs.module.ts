import { Module } from '@nestjs/common';
import { YjsService } from './yjs.service';
import { NodeModule } from 'src/node/node.module';
import { NodeCacheModule } from 'src/node-cache/node-cache.module';

@Module({
  imports: [NodeModule, NodeCacheModule],
  providers: [YjsService],
})
export class YjsModule {}
