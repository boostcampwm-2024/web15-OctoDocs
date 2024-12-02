import { Module } from '@nestjs/common';
import { YjsService } from './yjs.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [YjsService],
})
export class YjsModule {}
