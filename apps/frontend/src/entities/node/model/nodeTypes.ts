import { type Node as FlowNode } from "@xyflow/react";

export interface Node extends FlowNode {
  isHolding: boolean;
}

export type NoteNodeData = {
  title: string;
  id: number;
  emoji: string;
};

export type NoteNodeType = FlowNode<NoteNodeData, "note">;
