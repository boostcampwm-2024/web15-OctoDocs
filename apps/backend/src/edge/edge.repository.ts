import { DataSource, Repository } from 'typeorm';
import { Edge } from './edge.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class EdgeRepository extends Repository<Edge> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(Edge, dataSource.createEntityManager());
  }

  async findEdgesByWorkspace(workspaceId: number): Promise<Edge[]> {
    return this.find({
      where: { workspace: { id: workspaceId } },
      relations: ['fromNode', 'toNode'],
    });
  }
}
