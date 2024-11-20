// user.repository.ts
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
}
