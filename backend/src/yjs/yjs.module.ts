import { Module } from '@nestjs/common';
import { YjsService } from './yjs.service';

@Module({
  providers: [YjsService],
})
export class YjsModule {}
