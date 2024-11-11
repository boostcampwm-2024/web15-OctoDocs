import { Injectable } from '@nestjs/common';
import { NodeRepository } from '../node/node.repository';
import { PageRepository } from './page.repository';
import { Page } from './page.entity';
import { CreatePageDto } from './dtos/createPage.dto';
import { UpdatePageDto } from './dtos/updatePage.dto';
import { PageNotFoundException } from '../exception/page.exception';

@Injectable()
export class PageService {
  constructor(
    private readonly pageRepository: PageRepository,
    private readonly nodeRepository: NodeRepository,
  ) {}

  async createPage(dto: CreatePageDto): Promise<Page> {
    const { title, content, x, y } = dto;

    // 페이지부터 생성한다.
    const page = await this.pageRepository.save({ title, content });

    // 노드를 생성한다.
    const node = await this.nodeRepository.save({ id: page.id, x, y });

    // 노드와 페이지를 서로 연결하여 저장한다.
    page.node = node;
    return await this.pageRepository.save(page);
  }

  async createLinkedPage(title: string, nodeId: number): Promise<Page> {
    // 노드를 조회한다.
    const existingNode = await this.nodeRepository.findOneBy({ id: nodeId });
    // 페이지를 생성한다.
    const page = await this.pageRepository.save({ title, content: {} });

    page.node = existingNode;
    return await this.pageRepository.save(page);
  }

  async deletePage(id: number): Promise<void> {
    // 페이지를 삭제한다.
    const deleteResult = await this.pageRepository.delete(id);

    // 만약 삭제된 페이지가 없으면 페이지를 찾지 못한 것
    if (!deleteResult.affected) {
      throw new PageNotFoundException();
    }
  }

  async updatePage(id: number, dto: UpdatePageDto): Promise<Page> {
    // 갱신할 페이지를 조회한다.
    // 페이지를 조회한다.
    const page = await this.pageRepository.findOneBy({ id });

    // 페이지가 없으면 NotFound 에러
    if (!page) {
      throw new PageNotFoundException();
    }
    // 페이지 정보를 갱신한다.
    const { title, content } = dto;
    page.title = title;
    page.content = content;

    return await this.pageRepository.save(page);
  }

  async findPageById(id: number): Promise<Page> {
    // 페이지를 조회한다.
    const page = await this.pageRepository.findOneBy({ id });

    // 페이지가 없으면 NotFound 에러
    if (!page) {
      throw new PageNotFoundException();
    }
    return page;
  }

  async findPages(): Promise<Partial<Page>[]> {
    return await this.pageRepository.findPageList();
  }
}
