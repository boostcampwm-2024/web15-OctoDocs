// edge.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Node } from '../node/node.entity';
import { Snowflake } from '@theinternetfolks/snowflake';

@Entity()
export class Edge {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  @Index()
  snowflakeId: string = Snowflake.generate();

  @ManyToOne(() => Node, (node) => node.outgoingEdges, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'from_node_id' })
  fromNode: Node;

  @ManyToOne(() => Node, (node) => node.incomingEdges, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'to_node_id' })
  toNode: Node;

  // @Column({ nullable: true })
  // type: string;

  // @Column({ nullable: true })
  // color: string;
}
