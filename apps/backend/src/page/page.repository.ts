import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Page } from './page.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { UpdatePartialPageDto } from './dtos/updatePartialPage.dto';

@Injectable()
export class PageRepository extends Repository<Page> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(Page, dataSource.createEntityManager());
  }

  async findPagesByWorkspace(workspaceId: number): Promise<Partial<Page>[]> {
    return this.find({
      where: { workspace: { id: workspaceId } },
      select: {
        id: true,
        title: true,
        emoji: true,
      },
    });
  }

  async bulkUpdate(pages: UpdatePartialPageDto[]) {
    await Promise.all(pages.map((page) => this.update(page.id, page)));
  }
}
