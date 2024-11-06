// node.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Page } from '../page/page.entity';
import { Edge } from '../edge/edge.entity';

@Entity()
export class Node {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('float')
  x: number;

  @Column('float')
  y: number;

  @Column()
  title: string;

  @OneToOne(() => Page, (page) => page.node, { cascade: true })
  @JoinColumn()
  page: Page;

  @OneToMany(() => Edge, (edge) => edge.fromNode)
  outgoingEdges: Edge[];

  @OneToMany(() => Edge, (edge) => edge.toNode)
  incomingEdges: Edge[];
}
