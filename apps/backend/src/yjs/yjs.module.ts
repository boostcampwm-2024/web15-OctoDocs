import { Module } from '@nestjs/common';
import { YjsService } from './yjs.service';
import { NodeModule } from 'src/node/node.module';

@Module({
  imports: [NodeModule],
  providers: [YjsService],
})
export class YjsModule {}
