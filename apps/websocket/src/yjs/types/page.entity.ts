import { Node } from './node.entity';

export class Page {
  id: number;

  title: string;

  content: JSON;

  createdAt: Date;

  updatedAt: Date;

  version: number;

  emoji: string | null;

  node: Node;

  workspace: unknown;
}
