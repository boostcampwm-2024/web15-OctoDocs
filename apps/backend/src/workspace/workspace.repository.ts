import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Workspace } from './workspace.entity';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class WorkspaceRepository extends Repository<Workspace> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(Workspace, dataSource.createEntityManager());
  }
}
