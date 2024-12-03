import { Node } from './node.entity';

export class Edge {
  id: number;

  fromNode: Node;

  toNode: Node;

  workspace: unknown;

  // @Column({ nullable: true })
  // type: string;

  // @Column({ nullable: true })
  // color: string;
}
