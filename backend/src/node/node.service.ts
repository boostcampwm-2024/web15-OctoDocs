import { Injectable, NotFoundException } from '@nestjs/common';
import { NodeRepository } from './node.repository';

@Injectable()
export class NodeService {
  constructor(private readonly nodeRepository: NodeRepository) {}

  async deleteNode(id: number): Promise<void> {
    const node = await this.nodeRepository.findOneBy({ id });
    if (!node) {
      throw new NotFoundException(`Node with ID ${id} not found`);
    }
    await this.nodeRepository.delete(id);
  }
}
