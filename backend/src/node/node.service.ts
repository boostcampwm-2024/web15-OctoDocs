import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { NodeRepository } from './node.repository';
import { PageService } from '../page/page.service';
import { Node } from './node.entity';
import { CreateNodeDto, UpdateNodeDto } from './node.dto';

@Injectable()
export class NodeService {
  constructor(
    private readonly nodeRepository: NodeRepository,
    private readonly pageService: PageService,
  ) {}

  async createNode(dto: CreateNodeDto): Promise<void> {
    try {
      const { title, x, y } = dto;
      const node = this.nodeRepository.create({ x, y });

      const savedNode = await this.nodeRepository.save(node);
      const newPage = await this.pageService.createLinkedPage(title, node.id);
      savedNode.page = newPage;
      await this.nodeRepository.save(savedNode);
    } catch (error) {
      throw new InternalServerErrorException(`Failed to create node`);
    }
  }

  async createLinkedNode(x: number, y: number, pageId: number): Promise<void> {
    try {
      const node = this.nodeRepository.create({ x, y });
      const existingPage = await this.pageService.findPageById(pageId);
      node.page = existingPage;
      await this.nodeRepository.save(node);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create node linked to page with ID ${pageId}`,
      );
    }
  }

  async deleteNode(id: number): Promise<void> {
    await this.findNodeById(id);

    try {
      const deleteResult = await this.nodeRepository.delete(id);
      if (!deleteResult.affected) {
        throw new NotFoundException(`Node with ID ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to delete node with ID ${id}`,
      );
    }
  }

  async updateNode(id: number, dto: UpdateNodeDto): Promise<Node> {
    const node = await this.findNodeById(id);
    const existingPage = await this.pageService.findPageById(node.page.id);
    const { x, y, title } = dto;
    node.x = x;
    node.y = y;
    existingPage.title = title;

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

  async getCoordinates(id: number): Promise<{ x: number; y: number }> {
    const node = await this.findNodeById(id);
    return {
      x: node.x,
      y: node.y,
    };
  }
}
