import { Injectable, Inject } from '@nestjs/common';
import { NodeRepository } from '../node/node.repository';
import { WorkspaceRepository } from '../workspace/workspace.repository';
import { PageRepository } from './page.repository';
import { Page } from './page.entity';
import { CreatePageDto } from './dtos/createPage.dto';
import { UpdatePageDto } from './dtos/updatePage.dto';
import { UpdatePartialPageDto } from './dtos/updatePartialPage.dto';
import { PageNotFoundException } from '../exception/page.exception';
import { WorkspaceNotFoundException } from '../exception/workspace.exception';
import Redlock from 'redlock';

const RED_LOCK_TOKEN = 'RED_LOCK';

@Injectable()
export class PageService {
  constructor(
    private readonly pageRepository: PageRepository,
    private readonly nodeRepository: NodeRepository,
    private readonly workspaceRepository: WorkspaceRepository,
    @Inject(RED_LOCK_TOKEN) private readonly redisLock: Redlock,
  ) {}
  /**
   * redis에 저장된 페이지 정보를 다음 과정을 통해 주기적으로 데이터베이스에 반영한다.
   *
   * 1. redis에서 해당 페이지의 title과 content를 가져온다.
   * 2. 데이터베이스에 해당 페이지의 title과 content를 갱신한다.
   * 3. redis에서 해당 페이지 정보를 삭제한다.
   *
   * 만약 1번 과정을 진행한 상태에서 page가 삭제된다면 오류가 발생한다.
   * 위 과정을 진행하는 동안 page 정보 수정을 막기 위해 lock을 사용한다.
   *
   * 동기화를 위해 기존 페이지에 접근하여 수정하는 로직은 RedLock 알고리즘을 통해 락을 획득할 수 있을 때만 수행한다.
   * 기존 페이지에 접근하여 연산하는 로직의 경우 RedLock 알고리즘을 사용하여 동시 접근을 방지한다.
   */
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

  async deletePage(id: number): Promise<void> {
    // 락을 획득할 때까지 기다린다.
    const lock = await this.redisLock.acquire([`user:${id.toString()}`], 1000);
    try {
      // 페이지를 삭제한다.
      const deleteResult = await this.pageRepository.delete(id);

      // 만약 삭제된 페이지가 없으면 페이지를 찾지 못한 것
      if (!deleteResult.affected) {
        throw new PageNotFoundException();
      }
    } finally {
      // 락을 해제한다.
      await lock.release();
    }
  }

  async updatePage(id: number, dto: UpdatePageDto): Promise<Page> {
    // 락을 획득할 때까지 기다린다.
    const lock = await this.redisLock.acquire([`user:${id.toString()}`], 1000);
    try {
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
    } finally {
      await lock.release();
    }
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
