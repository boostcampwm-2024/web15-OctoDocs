import { Injectable, NotFoundException } from '@nestjs/common';
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
    nodeId?: number,
  ): Promise<Page> {
    const page = this.pageRepository.create({ title, content });

    if (nodeId) {
      const existingNode = await this.nodeService.findNodeById(nodeId);
      page.node = existingNode;
      return await this.pageRepository.save(page);
    } else {
      // TODO: include logic to decide x, y (instead of temp)
      const temp = 0;
      const savedPage = await this.pageRepository.save(page);
      const newNode = await this.nodeService.createNode(
        temp,
        temp,
        title,
        savedPage.id,
      );
      savedPage.node = newNode;
      return await this.pageRepository.save(savedPage);
    }
  }

  async deletePage(id: number): Promise<void> {
    const page = await this.pageRepository.findOneBy({ id });
    if (!page) {
      throw new NotFoundException(`Page with ID ${id} not found`);
    }
    await this.pageRepository.delete(id);
  }

  async findPageById(id: number): Promise<Page> {
    return await this.pageRepository.findOneBy({ id });
  }
}
