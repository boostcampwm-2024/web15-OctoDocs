import { useCallback, useMemo, useRef } from "react";
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
  type Node,
  NodeChange,
  Edge,
  EdgeChange,
  Connection,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { useEffect } from "react";
import { usePages } from "@/hooks/usePages";
import { NoteNode } from "./NoteNode";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { cn } from "@/lib/utils";

const proOptions = { hideAttribution: true };

interface CanvasProps {
  className?: string;
}

export default function Canvas({ className }: CanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const { pages } = usePages();

  const onConnect = useCallback((connection: Connection) => {
    if (!connection.source || !connection.target) return;

    const newEdge: Edge = {
      id: `e${connection.source}-${connection.target}`,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
    };

    if (ydoc.current) {
      ydoc.current.getMap("edges").set(newEdge.id, newEdge);
    }
  }, []);

  const handleEdgesChange = useCallback((changes: EdgeChange[]) => {
    if (!ydoc.current) return;

    changes.forEach((change) => {
      if (change.type === "remove") {
        ydoc.current?.getMap("edges").delete(change.id);
      }
    });
  }, []);

  const nodeTypes = useMemo(() => ({ note: NoteNode }), []);

  const ydoc = useRef<Y.Doc>();
  const provider = useRef<WebsocketProvider>();

  useEffect(() => {
    const doc = new Y.Doc();
    const wsProvider = new WebsocketProvider(
      "ws://localhost:1234",
      "flow-room",
      doc,
    );
    const nodesMap = doc.getMap("nodes");
    const edgesMap = doc.getMap("edges");

    ydoc.current = doc;
    provider.current = wsProvider;

    if (nodesMap.size === 0 && nodes.length > 0) {
      nodes.forEach((node) => {
        nodesMap.set(node.id, node);
      });
    }

    nodesMap.observe(() => {
      const yNodes = Array.from(nodesMap.values()) as Node[];
      setNodes([...yNodes]);
    });

    edgesMap.observe(() => {
      const yEdges = Array.from(edgesMap.values()) as Edge[];
      setEdges([...yEdges]);
    });

    return () => {
      wsProvider.destroy();
      doc.destroy();
    };
  }, []);

  useEffect(() => {
    if (pages && nodes.length === 0) {
      const newNodes = pages.map((page, index) => ({
        id: page.id.toString(),
        position: { x: 100 * index, y: 100 },
        data: { title: page.title, id: page.id },
        type: "note",
      }));
      setNodes([...newNodes]);
    }
  }, [pages, setNodes, nodes.length]);

  // const handleNodesChange = useCallback(
  //   (changes: NodeChange[]) => {
  //     if (!ydoc.current) return;

  //     changes.forEach((change) => {
  //       if (change.type === "position") {
  //         const node = nodes.find((n) => n.id === change.id);
  //         if (node) {
  //           const updatedNode = {
  //             ...node,
  //             position: change.position,
  //           };
  //           ydoc.current?.getMap("nodes").set(change.id, updatedNode);

  //         }
  //       }
  //     });
  //   },
  //   [nodes],
  // );

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      if (!ydoc.current) return;

      console.log("Changes:", changes);

      changes.forEach((change) => {
        if (change.type === "position" && change.position) {
          const nodeIndex = nodes.findIndex((n) => n.id === change.id);
          if (nodeIndex !== -1) {
            const updatedNode = {
              ...nodes[nodeIndex],
              position: change.position,
            };
            ydoc.current?.getMap("nodes").set(change.id, updatedNode);
          }
        }
      });
    },
    [nodes],
  );
  return (
    <div className={cn("", className)}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
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
