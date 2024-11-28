import { DataSource, Repository } from 'typeorm';
import { Node } from './node.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class NodeRepository extends Repository<Node> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(Node, dataSource.createEntityManager());
  }

  async findById(id: number): Promise<Node | null> {
    return await this.findOneBy({ id });
  }

  async findNodesByWorkspace(workspaceId: number): Promise<Node[]> {
    return this.find({
      where: { workspace: { id: workspaceId } },
      relations: ['page'],
    });
  }
}
