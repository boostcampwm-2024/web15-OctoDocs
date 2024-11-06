import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PageRepository } from './page.repository';
import { NodeService } from 'src/node/node.service';
import { Page } from './page.entity';

@Injectable()
export class PageService {
  constructor(
    private readonly pageRepository: PageRepository,
    private readonly nodeService: NodeService,
  ) {}

  async createPage(
    title: string,
    content: JSON,
    x: number,
    y: number,
  ): Promise<Page> {
    try {
      const page = this.pageRepository.create({ title, content });
      const savedPage = await this.pageRepository.save(page);
      const newNode = await this.nodeService.createLinkedNode(
        x,
        y,
        title,
        savedPage.id,
      );
      savedPage.node = newNode;
      return await this.pageRepository.save(savedPage);
    } catch (error) {
      throw new InternalServerErrorException(`Failed to create page`);
    }
  }

  async createLinkedPage(title: string, nodeId: number): Promise<Page> {
    try {
      const page = this.pageRepository.create({ title, content: null });
      const existingNode = await this.nodeService.findNodeById(nodeId);
      page.node = existingNode;
      return await this.pageRepository.save(page);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create page linked to node with ID ${nodeId}`,
      );
    }
  }

  async deletePage(id: number): Promise<void> {
    try {
      const deleteResult = await this.pageRepository.delete(id);
      if (!deleteResult.affected) {
        throw new NotFoundException(`Page with ID ${id} not found`);
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete page with ID ${id}`,
      );
    }
  }

  async updatePage(id: number, title: string, content: JSON): Promise<Page> {
    const page = await this.findPageById(id);
    page.title = title;
    page.content = content;

    try {
      return await this.pageRepository.save(page);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update page with ID ${id}`,
      );
    }
  }

  async findPageById(id: number): Promise<Page> {
    const page = await this.pageRepository.findOneBy({ id });
    if (!page) {
      throw new NotFoundException(`Page with ID ${id} not found`);
    }
    return page;
  }
}
