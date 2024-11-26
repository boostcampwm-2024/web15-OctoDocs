import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Role } from './role.entity';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class RoleRepository extends Repository<Role> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(Role, dataSource.createEntityManager());
  }
}
