import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Page } from './page.entity';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class PageRepository extends Repository<Page> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(Page, dataSource.createEntityManager());
  }

  async findPageList(): Promise<Page[]> {
    return await this.find({
      select: {
        id: true,
        title: true,
        emoji: true,
      },
    });
  }

  async findPagesByWorkspace(workspaceId: number): Promise<Page[]> {
    return this.find({ where: { workspace: { id: workspaceId } } });
  }

  async bulkUpdate(pages) {
    await this.createQueryBuilder()
      .insert()
      .into(Page)
      .values(pages)
      .orUpdate(['title', 'content'], ['id'])
      .execute();
  }
}
