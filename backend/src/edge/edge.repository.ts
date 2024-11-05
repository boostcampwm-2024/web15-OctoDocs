import { DataSource, Repository } from 'typeorm';
import { Edge } from './edge.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EdgeRepository extends Repository<Edge> {
  constructor(private dataSource: DataSource) {
    super(Edge, dataSource.createEntityManager());
  }
}
