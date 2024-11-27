import { Injectable } from '@nestjs/common';
import { EdgeRepository } from './edge.repository';
import { NodeRepository } from '../node/node.repository';
import { Edge } from './edge.entity';
import { CreateEdgeDto } from './dtos/createEdge.dto';
import { EdgeNotFoundException } from '../exception/edge.exception';
import { WorkspaceRepository } from '../workspace/workspace.repository';
import { WorkspaceNotFoundException } from '../exception/workspace.exception';

@Injectable()
export class EdgeService {
  constructor(
    private readonly edgeRepository: EdgeRepository,
    private readonly nodeRepository: NodeRepository,
    private readonly workspaceRepository: WorkspaceRepository,
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

  async findEdgeByFromNodeAndToNode(fromNodeId: number, toNodeId: number) {
    return this.edgeRepository.findOne({
      where: {
        fromNode: { id: fromNodeId },
        toNode: { id: toNodeId },
      },
      relations: ['fromNode', 'toNode'],
    });
  }

  async findEdgesByWorkspace(workspaceId: string): Promise<Edge[]> {
    // 워크스페이스 DB에서 해당 워크스페이스의 내부 id를 찾는다
    const workspace = await this.workspaceRepository.findOneBy({
      snowflakeId: workspaceId,
    });

    if (!workspace) {
      throw new WorkspaceNotFoundException();
    }

    return await this.edgeRepository.findEdgesByWorkspace(workspace.id);
  }
}
