import { Injectable } from '@nestjs/common';
import { NodeRepository } from '../node/node.repository';
import { WorkspaceRepository } from '../workspace/workspace.repository';
import { PageRepository } from './page.repository';
import { Page } from './page.entity';
import { CreatePageDto } from './dtos/createPage.dto';
import { UpdatePageDto } from './dtos/updatePage.dto';
import { UpdatePartialPageDto } from './dtos/updatePartialPage.dto';
import { PageNotFoundException } from '../exception/page.exception';
import { WorkspaceNotFoundException } from '../exception/workspace.exception';

@Injectable()
export class PageService {
  constructor(
    private readonly pageRepository: PageRepository,
    private readonly nodeRepository: NodeRepository,
    private readonly workspaceRepository: WorkspaceRepository,
  ) {}

  async createPage(dto: CreatePageDto): Promise<Page> {
    const { title, content, workspaceId, x, y, emoji } = dto;

    // 워크스페이스 DB에서 해당 워크스페이스의 내부 id를 찾는다
    const workspace = await this.workspaceRepository.findOneBy({
      snowflakeId: workspaceId,
    });

    if (!workspace) {
      throw new WorkspaceNotFoundException();
    }

    // 노드부터 생성한다.
    const node = await this.nodeRepository.save({ title, x, y, workspace });

    // 페이지를 생성한다.
    const page = await this.pageRepository.save({
      title,
      content,
      emoji,
      workspace,
      node,
    });

    // 페이지와 노드를 서로 연결하여 저장한다.
    node.page = page;
    await this.nodeRepository.save(node);
    return page;
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
    const newPage = Object.assign({}, page, dto);

    // 변경된 페이지를 저장
    return await this.pageRepository.save(newPage);
  }

  async updateBulkPage(pages: UpdatePartialPageDto[]) {
    await this.pageRepository.bulkUpdate(pages);
  }

  async findPageById(id: number): Promise<Page> {
    // 페이지를 조회한다.
    const page = await this.pageRepository.findOne({
      where: { id },
      relations: ['node'],
    });

    // 페이지가 없으면 NotFound 에러
    if (!page) {
      throw new PageNotFoundException();
    }
    return page;
  }

  async findPagesByWorkspace(workspaceId: string): Promise<Partial<Page>[]> {
    // 워크스페이스 DB에서 해당 워크스페이스의 내부 id를 찾는다
    const workspace = await this.workspaceRepository.findOneBy({
      snowflakeId: workspaceId,
    });

    if (!workspace) {
      throw new WorkspaceNotFoundException();
    }

    return await this.pageRepository.findPagesByWorkspace(workspace.id);
  }
}
