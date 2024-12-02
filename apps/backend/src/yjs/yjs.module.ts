import { Module } from '@nestjs/common';
import { YjsService } from './yjs.service';
import { NodeModule } from '../node/node.module';
import { PageModule } from '../page/page.module';
import { EdgeModule } from '../edge/edge.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [NodeModule, PageModule, EdgeModule, RedisModule],
  providers: [YjsService],
})
export class YjsModule {}
