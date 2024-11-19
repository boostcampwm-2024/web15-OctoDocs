// edge.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  // Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Node } from '../node/node.entity';

@Entity()
export class Edge {
  @PrimaryGeneratedColumn('increment')
  id: number;

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
