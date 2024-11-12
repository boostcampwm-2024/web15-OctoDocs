import { cn } from "@/lib/utils";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  ConnectionMode,
  type OnConnect,
  type Node,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { useEffect } from "react";
import { usePages } from "@/hooks/usePages";
import { NoteNode } from "./NoteNode";

const proOptions = { hideAttribution: true };

interface CanvasProps {
  className?: string;
}

export default function Canvas({ className }: CanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { pages } = usePages();

  useEffect(() => {
    if (!pages) {
      return;
    }

    const newNodes = pages.map((page, index) => ({
      id: page.id.toString(),
      position: { x: 100 * index, y: 100 },
      data: { title: page.title, id: page.id },
      type: "note",
    }));
    setNodes(newNodes);
  }, [pages, setNodes]);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const nodeTypes = useMemo(() => ({ note: NoteNode }), []);

  return (
    <div className={cn("", className)}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        proOptions={proOptions}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
