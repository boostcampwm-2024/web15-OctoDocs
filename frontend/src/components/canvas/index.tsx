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
  type Edge,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { useEffect } from "react";
import { usePages } from "@/hooks/usePages";
import { type NoteNodeType, NoteNode } from "./NoteNode";

// 테스트용 초기값
const initialNodes: NoteNodeType[] = [
  {
    id: "1",
    position: { x: 100, y: 100 },
    type: "note",
    data: {
      id: 0,
      title: "Node 1",
    },
  },
  {
    id: "2",
    position: { x: 400, y: 200 },
    type: "note",
    data: {
      id: 1,
      title: "Node 2",
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    sourceHandle: "top",
    targetHandle: "left",
  },
];

const proOptions = { hideAttribution: true };

interface CanvasProps {
  className?: string;
}

export default function Canvas({ className }: CanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const { data } = usePages();
  const pages = data?.data;

  useEffect(() => {
    if (!pages) {
      return;
    }

    const newNodes = pages.map((page, index) => ({
      id: page.id.toString(),
      position: { x: 100 * index, y: 100 },
      data: { label: page.title, id: page.id },
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
