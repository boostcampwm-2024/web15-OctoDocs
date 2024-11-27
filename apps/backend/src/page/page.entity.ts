import {
  Column,
  Entity,
  OneToOne,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { Node } from '../node/node.entity';
import { Workspace } from '../workspace/workspace.entity';

@Entity()
export class Page {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column('json') //TODO: Postgres에서는 jsonb로 변경
  content: JSON;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @VersionColumn()
  version: number;

  @Column({ nullable: true })
  emoji: string | null;

  @OneToOne(() => Node, (node) => node.page, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  node: Node;

  @ManyToOne(() => Workspace, (workspace) => workspace.pages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace;
}
