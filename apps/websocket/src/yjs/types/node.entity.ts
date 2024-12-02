import { Page } from './page.entity';
import { Edge } from './edge.entity';

export class Node {
  id: number;

  x: number;

  y: number;

  page: Page;

  outgoingEdges: Edge[];

  incomingEdges: Edge[];

  workspace: unknown;
}
