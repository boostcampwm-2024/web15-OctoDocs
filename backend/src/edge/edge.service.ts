import { Injectable } from '@nestjs/common';
import { EdgeRepository } from './edge.repository';
import { Edge } from './edge.entity';

@Injectable()
export class EdgeService {
  constructor(private edgeRepository: EdgeRepository) {}

  async createEdge(dto: CreateEdgeDto): Promise<Edge> {

    const edge = await this.edgeRepository.save {}

  }
}
