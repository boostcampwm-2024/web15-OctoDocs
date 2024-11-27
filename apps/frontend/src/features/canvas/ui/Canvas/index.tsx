import { useMemo } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  ConnectionMode,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { CollaborativeCursors } from "../CollaborativeCursors";
import { NoteNode, GroupNode } from "../Node";

import { useCanvas } from "../../model/useCanvas";
import { cn } from "@/shared/lib";

const proOptions = { hideAttribution: true };

export interface YNode extends Node {
  isHolding: boolean;
}

interface CanvasProps {
  className?: string;
}

export function Canvas({ className }: CanvasProps) {
  const {
    handleMouseMove,
    nodes,
    edges,
    handleNodesChange,
    handleEdgesChange,
    handleMouseLeave,
    handleNodeDrag,
    onNodeDragStart,
    onNodeDragStop,
    onConnect,
    sortNodes,
    cursors,
  } = useCanvas();

  const nodeTypes = useMemo(() => ({ note: NoteNode, group: GroupNode }), []);

  return (
    <div className={cn("", className)} onMouseMove={handleMouseMove}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onMouseLeave={handleMouseLeave}
        onNodeDrag={handleNodeDrag}
        onNodeDragStart={onNodeDragStart}
        onNodeDragStop={onNodeDragStop}
        onConnect={onConnect}
        proOptions={proOptions}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        selectNodesOnDrag={false}
      >
        <Controls />
        <div className="fixed bottom-5 left-16 z-30 h-4 w-4 text-neutral-50 hover:cursor-pointer">
          <button onClick={sortNodes}>Sort</button>
        </div>
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <CollaborativeCursors cursors={cursors} />
      </ReactFlow>
    </div>
  );
}
