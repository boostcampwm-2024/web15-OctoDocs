// node.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Page } from '../page/page.entity';
import { Edge } from '../edge/edge.entity';
import { Snowflake } from '@theinternetfolks/snowflake';

@Entity()
export class Node {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  @Index()
  snowflakeId: string = Snowflake.generate();

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
}
