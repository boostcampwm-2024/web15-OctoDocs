import { useCallback, useMemo, useRef, useEffect } from "react";
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
import { usePages } from "@/hooks/usePages";
import { NoteNode } from "./NoteNode";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

const proOptions = { hideAttribution: true };

interface CanvasProps {
  className?: string;
}

export default function Canvas({ className }: CanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { pages } = usePages();
  const queryClient = useQueryClient();

  const ydoc = useRef<Y.Doc>();
  const provider = useRef<WebsocketProvider>();
  const existingPageIds = useRef(new Set<string>());

  useEffect(() => {
    const doc = new Y.Doc();
    const wsProvider = new WebsocketProvider(
      import.meta.env.VITE_WS_URL,
      "flow-room",
      doc,
    );

    ydoc.current = doc;
    provider.current = wsProvider;

    const nodesMap = doc.getMap("nodes");
    const edgesMap = doc.getMap("edges");

    nodesMap.observe((event) => {
      event.changes.keys.forEach((change, key) => {
        const nodeId = key;
        if (change.action === "add" || change.action === "update") {
          const node = nodesMap.get(nodeId) as Node;

          if (change.action === "add") {
            queryClient.invalidateQueries({ queryKey: ["pages"] });
          }

          setNodes((nds) => {
            const index = nds.findIndex((n) => n.id === nodeId);
            if (index === -1) {
              return [...nds, node];
            }
            const newNodes = [...nds];
            newNodes[index] = node;
            return newNodes;
          });
        } else if (change.action === "delete") {
          setNodes((nds) => nds.filter((n) => n.id !== nodeId));
          queryClient.invalidateQueries({ queryKey: ["pages"] });
        }
      });
    });

    edgesMap.observe(() => {
      const yEdges = Array.from(edgesMap.values()) as Edge[];
      setEdges(yEdges);
    });

    return () => {
      wsProvider.destroy();
      doc.destroy();
    };
  }, [queryClient]);

  useEffect(() => {
    if (!pages || !ydoc.current) return;

    const nodesMap = ydoc.current.getMap("nodes");
    const currentPageIds = new Set(pages.map((page) => page.id.toString()));

    existingPageIds.current.forEach((pageId) => {
      if (!currentPageIds.has(pageId)) {
        nodesMap.delete(pageId);
        existingPageIds.current.delete(pageId);
      }
    });

    pages.forEach((page) => {
      const pageId = page.id.toString();
      if (!existingPageIds.current.has(pageId)) {
        const newNode = {
          id: pageId,
          position: {
            x: Math.random() * 500,
            y: Math.random() * 500,
          },
          data: { title: page.title, id: page.id },
          type: "note",
        };

        nodesMap.set(pageId, newNode);
        existingPageIds.current.add(pageId);
      }
    });
  }, [pages]);

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      if (!ydoc.current) return;
      const nodesMap = ydoc.current.getMap("nodes");

      onNodesChange(changes);

      changes.forEach((change) => {
        if (change.type === "position" && change.position) {
          const node = nodes.find((n) => n.id === change.id);
          if (node) {
            const updatedNode = {
              ...node,
              position: change.position,
            };
            nodesMap.set(change.id, updatedNode);
          }
        }
      });
    },
    [nodes, onNodesChange],
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      if (!ydoc.current) return;
      const edgesMap = ydoc.current.getMap("edges");

      changes.forEach((change) => {
        if (change.type === "remove") {
          edgesMap.delete(change.id);
        }
      });

      onEdgesChange(changes);
    },
    [onEdgesChange],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target || !ydoc.current) return;

      const newEdge: Edge = {
        id: `e${connection.source}-${connection.target}`,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle || undefined,
        targetHandle: connection.targetHandle || undefined,
      };

      ydoc.current.getMap("edges").set(newEdge.id, newEdge);
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges],
  );

  const nodeTypes = useMemo(() => ({ note: NoteNode }), []);

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
