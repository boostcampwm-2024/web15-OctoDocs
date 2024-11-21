import { Module } from '@nestjs/common';
import { YjsService } from './yjs.service';
import { NodeModule } from 'src/node/node.module';
import { NodeCacheModule } from 'src/node-cache/node-cache.module';
import { PageModule } from '../page/page.module';
import { EdgeModule } from '../edge/edge.module';

@Module({
  imports: [NodeModule, PageModule, EdgeModule, NodeCacheModule],
  providers: [YjsService],
})
export class YjsModule {}
