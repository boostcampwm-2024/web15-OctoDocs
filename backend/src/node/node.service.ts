import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
    try {
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
    } catch (error) {
      throw new InternalServerErrorException(`Failed to create node`);
    }
  }

  async deleteNode(id: number): Promise<void> {
    await this.findNodeById(id);

    try {
      await this.nodeRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete node with ID ${id}`,
      );
    }
  }

  async updateNode(
    id: number,
    x: number,
    y: number,
    title: string,
  ): Promise<Node> {
    const node = await this.findNodeById(id);

    node.x = x;
    node.y = y;
    node.title = title;

    try {
      return await this.nodeRepository.save(node);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update node with ID ${id}`,
      );
    }
  }

  async findNodeById(id: number): Promise<Node> {
    const node = await this.nodeRepository.findOneBy({ id });
    if (!node) {
      throw new NotFoundException(`Node with ID ${id} not found`);
    }
    return node;
  }
}
