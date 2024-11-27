// node.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Page } from '../page/page.entity';
import { Edge } from '../edge/edge.entity';
import { Workspace } from '../workspace/workspace.entity';

@Entity()
export class Node {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('float')
  x: number;

  @Column('float')
  y: number;

  @OneToOne(() => Page, (page) => page.node, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  page: Page;

  @OneToMany(() => Edge, (edge) => edge.fromNode)
  outgoingEdges: Edge[];

  @OneToMany(() => Edge, (edge) => edge.toNode)
  incomingEdges: Edge[];

  @ManyToOne(() => Workspace, (workspace) => workspace.nodes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace;
}
