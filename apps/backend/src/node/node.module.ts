import { Module, forwardRef } from '@nestjs/common';
import { NodeService } from './node.service';
import { NodeController } from './node.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Node } from './node.entity';
import { NodeRepository } from './node.repository';
import { PageModule } from '../page/page.module';
import { WorkspaceModule } from '../workspace/workspace.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Node]),
    forwardRef(() => PageModule),
    WorkspaceModule,
  ],
  controllers: [NodeController],
  providers: [NodeService, NodeRepository],
  exports: [NodeService, NodeRepository],
})
export class NodeModule {}
