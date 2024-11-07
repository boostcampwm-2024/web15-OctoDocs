import { Injectable, NotFoundException } from '@nestjs/common';
import { NodeRepository } from './node.repository';

@Injectable()
export class NodeService {
  constructor(private readonly nodeRepository: NodeRepository) {}

  async getCoordinates(id: number) {
    const node = await this.nodeRepository.findById(id);
    if (!node) {
      throw new NotFoundException('해당 노드를 찾을 수 없습니다.');
    }
    return {
      x: node.x,
      y: node.y,
    };
  }
}
