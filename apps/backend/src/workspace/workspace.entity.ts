import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Edge } from '../edge/edge.entity';
import { Page } from '../page/page.entity';
import { Node } from '../node/node.entity';

@Entity()
export class Workspace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Index()
  snowflakeId: string;

  @ManyToOne(() => User, { nullable: false })
  owner: User;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'private' })
  visibility: 'public' | 'private';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @OneToMany(() => Edge, (edge) => edge.workspace)
  edges: Edge[];

  @OneToMany(() => Page, (page) => page.workspace)
  pages: Page[];

  @OneToMany(() => Node, (node) => node.workspace)
  nodes: Node[];
}
