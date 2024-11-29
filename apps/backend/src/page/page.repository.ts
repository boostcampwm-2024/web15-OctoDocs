import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Page } from './page.entity';
import { InjectDataSource } from '@nestjs/typeorm';

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

  async bulkUpdate(pages) {
    await this.createQueryBuilder()
      .insert()
      .into(Page, ['id', 'title', 'content', 'version'])
      .values(pages)
      .orUpdate(['title', 'content', 'version'], ['id'])
      .execute();
  }
}
