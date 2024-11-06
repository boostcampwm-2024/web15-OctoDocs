import { Injectable, NotFoundException } from '@nestjs/common';
import { NodeRepository } from './node.repository';
import { PageService } from 'src/page/page.service';
import { Node } from './node.entity';

@Injectable()
export class NodeService {
  constructor(
    private readonly nodeRepository: NodeRepository,
    private readonly pageService: PageService,
  ) {}

  async createNode(
    x: number,
    y: number,
    title: string,
    pageId?: number,
  ): Promise<Node> {
    const node = this.nodeRepository.create({ x, y });

    if (pageId) {
      const existingPage = await this.pageService.findPageById(pageId);
      node.page = existingPage;
      return await this.nodeRepository.save(node);
    } else {
      const savedNode = await this.nodeRepository.save(node);
      const newPage = await this.pageService.createPage(title, null, node.id);
      savedNode.page = newPage;
      return await this.nodeRepository.save(savedNode);
    }
  }

  async deleteNode(id: number): Promise<void> {
    const node = await this.findNodeById(id);
    if (!node) {
      throw new NotFoundException(`Node with ID ${id} not found`);
    }
    await this.nodeRepository.delete(id);
  }

  async findNodeById(id: number): Promise<Node> {
    return await this.nodeRepository.findOneBy({ id });
  }
}
