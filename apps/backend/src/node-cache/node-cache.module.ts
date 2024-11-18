import { Module, Global } from '@nestjs/common';
import { NodeCacheService } from './node-cache.service';

@Global()
@Module({
  providers: [NodeCacheService],
  exports: [NodeCacheService],
})
export class NodeCacheModule {}
