import { Injectable } from '@nestjs/common';
import { EdgeRepository } from './edge.repository';
import { NodeRepository } from '../node/node.repository';
import { Edge } from './edge.entity';
import { CreateEdgeDto } from './dtos/createEdge.dto';
import { EdgeNotFoundException } from '../exception/edge.exception';

@Injectable()
export class EdgeService {
  constructor(
    private readonly edgeRepository: EdgeRepository,
    private readonly nodeRepository: NodeRepository,
  ) {}

  async createEdge(dto: CreateEdgeDto): Promise<Edge> {
    const { fromNode, toNode } = dto;

    // 출발 노드를 조회한다.
    const existingFromNode = await this.nodeRepository.findOneBy({
      id: fromNode,
    });
    // 도착 노드를 조회한다.
    const existingToNode = await this.nodeRepository.findOneBy({ id: toNode });

    // 엣지를 생성한다.
    return await this.edgeRepository.save({
      fromNode: existingFromNode,
      toNode: existingToNode,
    });
  }

  async deleteEdge(id: number): Promise<void> {
    // 엣지를 삭제한다
    const deleteResult = await this.edgeRepository.delete(id);

    // 삭제된 엣지가 없으면 노드를 찾지 못한 것
    if (!deleteResult.affected) {
      throw new EdgeNotFoundException();
    }
  }

  async findEdges(): Promise<Edge[]> {
    // 모든 엣지들을 조회한다.
    const edges = await this.edgeRepository.find({
      relations: ['fromNode', 'toNode'],
      select: {
        id: true,
        fromNode: {
          id: true,
        },
        toNode: {
          id: true,
        },
      },
    });
    // 엣지가 없으면 NotFound 에러
    if (!edges) {
      throw new EdgeNotFoundException();
    }
    return edges;
  }
}
