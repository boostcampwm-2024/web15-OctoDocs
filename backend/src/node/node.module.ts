import { Module } from '@nestjs/common';
import { NodeService } from './node.service';
import { NodeController } from './node.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Node } from './node.entity';
import { NodeRepository } from './node.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Node])],
  controllers: [NodeController],
  providers: [NodeService, NodeRepository],
})
export class NodeModule {}
