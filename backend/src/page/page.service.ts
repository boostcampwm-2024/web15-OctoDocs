import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PageRepository } from './page.repository';
import { NodeService } from '../node/node.service';
import { Page } from './page.entity';
import { CreatePageDto, UpdatePageDto } from './page.dto';

@Injectable()
export class PageService {
  constructor(
    private pageRepository: PageRepository,
    @Inject(forwardRef(() => NodeService))
    private readonly nodeService: NodeService,
  ) {}

  async createPage(dto: CreatePageDto): Promise<Page> {
    try {
      const { title, content, x, y } = dto;
      const page = this.pageRepository.create({ title, content });
      const savedPage = await this.pageRepository.save(page);
      const newNode = await this.nodeService.createLinkedNode(
        x,
        y,
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
      const page = this.pageRepository.create({ title, content: {} });
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
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to delete page with ID ${id}`,
      );
    }
  }

  async updatePage(id: number, dto: UpdatePageDto): Promise<Page> {
    const page = await this.findPageById(id);
    const { title, content } = dto;
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

  async getPages() {
    return await this.pageRepository.findAll();
  }

  async getPage(id: number) {
    return await this.pageRepository.findOneBy({ id });
  }
}
