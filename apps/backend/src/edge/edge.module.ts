import { Module, forwardRef } from '@nestjs/common';
import { EdgeService } from './edge.service';
import { EdgeController } from './edge.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Edge } from './edge.entity';
import { EdgeRepository } from './edge.repository';
import { NodeModule } from 'src/node/node.module';

@Module({
  imports: [TypeOrmModule.forFeature([Edge]), forwardRef(() => NodeModule)],
  controllers: [EdgeController],
  providers: [EdgeService, EdgeRepository],
  exports: [EdgeService]
})
export class EdgeModule {}
