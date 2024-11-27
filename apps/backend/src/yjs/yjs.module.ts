import { Module } from '@nestjs/common';
import { YjsService } from './yjs.service';
import { NodeModule } from 'src/node/node.module';
import { PageModule } from '../page/page.module';
import { EdgeModule } from '../edge/edge.module';
import { RedisModule } from '../redis/redis.module';
import { RedisService } from '../redis/redis.service';

@Module({
  imports: [NodeModule, PageModule, EdgeModule, RedisModule],
  providers: [YjsService, RedisService],
})
export class YjsModule {}
