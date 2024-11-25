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
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ELK from "elkjs";
import { SocketIOProvider } from "y-socket.io";
import { useQueryClient } from "@tanstack/react-query";

import { CollaborativeCursors } from "../CursorView";
import { NoteNode } from "./NoteNode";

import { usePages } from "@/hooks/usePages";
import { cn } from "@/lib/utils";
import useYDocStore from "@/store/useYDocStore";
import { useCollaborativeCursors } from "@/hooks/useCursor";
import { calculateBestHandles } from "@/lib/calculateBestHandles";
import { createSocketIOProvider } from "@/lib/socketProvider";
import { initializeYText } from "@/service/yjs";

const elk = new ELK();

const proOptions = { hideAttribution: true };

export interface YNode extends Node {
  isHolding: boolean;
}

interface CanvasProps {
  className?: string;
}

function Flow({ className }: CanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { pages } = usePages();
  const queryClient = useQueryClient();
  const { ydoc } = useYDocStore();

  const { cursors, handleMouseMove, handleNodeDrag, handleMouseLeave } =
    useCollaborativeCursors({
      ydoc,
      roomName: "flow-room",
    });

  const provider = useRef<SocketIOProvider>();
  const existingPageIds = useRef(new Set<string>());
  const holdingNodeRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pages) return;

    const yTitleMap = ydoc.getMap("title");
    const yEmojiMap = ydoc.getMap("emoji");

    pages.forEach((page) => {
      initializeYText(yTitleMap, `title_${page.id}`, page.title);
      initializeYText(yEmojiMap, `emoji_${page.id}`, page.emoji || "");
    });
  }, [pages]);

  useEffect(() => {
    if (!ydoc) return;

    const wsProvider = createSocketIOProvider("flow-room", ydoc);

    provider.current = wsProvider;

    const nodesMap = ydoc.getMap("nodes");
    const edgesMap = ydoc.getMap("edges");

    const yNodes = Array.from(nodesMap.values()) as YNode[];

    const initialNodes = yNodes.map((yNode) => {
      const nodeEntries = Object.entries(yNode).filter(
        ([key]) => key !== "isHolding",
      );
      return Object.fromEntries(nodeEntries) as Node;
    });

    setNodes(initialNodes);

    let isInitialSync = true;

    nodesMap.observe((event) => {
      if (isInitialSync) {
        isInitialSync = false;
        return;
      }

      event.changes.keys.forEach((change, key) => {
        const nodeId = key;
        if (change.action === "add" || change.action === "update") {
          const updatedYNode = nodesMap.get(nodeId) as YNode;
          const updatedNodeEntries = Object.entries(updatedYNode).filter(
            ([key]) => key !== "isHolding",
          );
          const updatedNode = Object.fromEntries(updatedNodeEntries) as Node;

          if (change.action === "add") {
            queryClient.invalidateQueries({ queryKey: ["pages"] });
          }

          setNodes((nds) => {
            const index = nds.findIndex((n) => n.id === nodeId);
            if (index === -1) {
              return [...nds, updatedNode];
            }
            const newNodes = [...nds];
            newNodes[index] = {
              ...updatedNode,
              selected: newNodes[index].selected,
            };
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
    };
  }, [ydoc, queryClient]);

  useEffect(() => {
    if (!pages || !ydoc) return;

    const nodesMap = ydoc.getMap("nodes");
    const currentPageIds = new Set(pages.map((page) => page.id.toString()));

    existingPageIds.current.forEach((pageId) => {
      if (!currentPageIds.has(pageId)) {
        nodesMap.delete(pageId);
        existingPageIds.current.delete(pageId);
      }
    });

    pages.forEach((page) => {
      const pageId = page.id.toString();
      const existingNode = nodesMap.get(pageId) as YNode | undefined;

      const newNode: YNode = {
        id: pageId,
        type: "note",
        data: { title: page.title, id: page.id, emoji: page.emoji },
        position: existingNode?.position || {
          x: Math.random() * 500,
          y: Math.random() * 500,
        },
        selected: false,
        isHolding: false,
      };

      nodesMap.set(pageId, newNode);
      existingPageIds.current.add(pageId);
    });
  }, [pages, ydoc]);

  const performLayout = async () => {
    const graph = {
      id: "root",
      layoutOptions: {
        "elk.algorithm": "force",
      },
      children: nodes.map((node) => ({
        id: node.id,
        width: 160, // 실제 노드 너비로 변경하기 (node.width)
        height: 40, // 실제 노드 높이로 변경하기 (node.height)
      })),
      edges: edges.map((edge) => ({
        id: edge.id,
        sources: [edge.source],
        targets: [edge.target],
      })),
    };

    const layout = await elk.layout(graph);

    const updatedNodes = nodes.map((node) => {
      const layoutNode = layout!.children!.find((n) => n.id === node.id);

      return {
        ...node,
        position: {
          x: layoutNode!.x as number,
          y: layoutNode!.y as number,
        },
      };
    });

    const nodesMap = ydoc.getMap("nodes");

    updatedNodes.forEach((updateNode) => {
      nodesMap.set(updateNode.id, updateNode);
    });

    setNodes(updatedNodes);
  };

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      if (!ydoc) return;
      const nodesMap = ydoc.getMap("nodes");
      const edgesMap = ydoc.getMap("edges");

      changes.forEach((change) => {
        if (change.type === "position" && change.position) {
          const node = nodes.find((n) => n.id === change.id);
          if (node) {
            const updatedYNode: YNode = {
              ...node,
              position: change.position,
              selected: false,
              isHolding: holdingNodeRef.current === change.id,
            };
            nodesMap.set(change.id, updatedYNode);

            const affectedEdges = edges.filter(
              (edge) => edge.source === change.id || edge.target === change.id,
            );

            affectedEdges.forEach((edge) => {
              const sourceNode = nodes.find((n) => n.id === edge.source);
              const targetNode = nodes.find((n) => n.id === edge.target);

              if (sourceNode && targetNode) {
                const bestHandles = calculateBestHandles(
                  sourceNode,
                  targetNode,
                );
                const updatedEdge = {
                  ...edge,
                  sourceHandle: bestHandles.source,
                  targetHandle: bestHandles.target,
                };
                edgesMap.set(edge.id, updatedEdge);
              }
            });
          }
        }
      });

      onNodesChange(changes);
    },
    [nodes, edges, onNodesChange],
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      if (!ydoc) return;
      const edgesMap = ydoc.getMap("edges");

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
      if (!connection.source || !connection.target || !ydoc) return;

      const isConnected = edges.some(
        (edge) =>
          (edge.source === connection.source &&
            edge.target === connection.target) ||
          (edge.source === connection.target &&
            edge.target === connection.source),
      );

      if (isConnected) return;

      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);

      if (sourceNode && targetNode) {
        const bestHandles = calculateBestHandles(sourceNode, targetNode);

        const newEdge: Edge = {
          id: `e${connection.source}-${connection.target}`,
          source: connection.source,
          target: connection.target,
          sourceHandle: bestHandles.source,
          targetHandle: bestHandles.target,
        };

        ydoc.getMap("edges").set(newEdge.id, newEdge);
        setEdges((eds) => addEdge(newEdge, eds));
      }
    },
    [setEdges, edges, nodes, ydoc],
  );

  const onNodeDragStart = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      holdingNodeRef.current = node.id;
    },
    [],
  );

  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (ydoc) {
        const nodesMap = ydoc.getMap("nodes");
        const yNode = nodesMap.get(node.id) as YNode | undefined;
        if (yNode) {
          nodesMap.set(node.id, { ...yNode, isHolding: false });
        }
      }
    },
    [ydoc],
  );

  const nodeTypes = useMemo(() => ({ note: NoteNode }), []);

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
          <button onClick={performLayout}>Sort</button>
        </div>
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <CollaborativeCursors cursors={cursors} />
      </ReactFlow>
    </div>
  );
}

export default function Canvas(props: CanvasProps) {
  return (
    <ReactFlowProvider>
      <Flow {...props} />
    </ReactFlowProvider>
  );
}
