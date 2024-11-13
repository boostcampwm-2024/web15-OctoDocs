// edge.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Node } from '../node/node.entity';

// TODO: frontend, backend가 공유하는 shared에 direction.enum.ts로 분리
// export enum Direction {
//   NORTH = 'N',
//   SOUTH = 'S',
//   EAST = 'E',
//   WEST = 'W',
// }

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

  @Column()
  fromPoint: string;

  @Column()
  toPoint: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  color: string;
}
