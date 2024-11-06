import { Module } from '@nestjs/common';
import { EdgeService } from './edge.service';
import { EdgeController } from './edge.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Edge } from './edge.entity';
import { EdgeRepository } from './edge.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Edge])],
  controllers: [EdgeController],
  providers: [EdgeService, EdgeRepository],
})
export class EdgeModule {}
