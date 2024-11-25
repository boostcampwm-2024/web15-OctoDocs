import { useCallback, useRef, useEffect } from "react";
import {
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  NodeChange,
  Edge,
  EdgeChange,
  Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { SocketIOProvider } from "y-socket.io";
import { useQueryClient } from "@tanstack/react-query";

import { usePages } from "@/features/pageSidebar/api/usePages";
import useYDocStore from "@/shared/model/ydocStore";
import { calculateBestHandles } from "@/features/canvas/model/calculateHandles";
import { createSocketIOProvider } from "@/shared/api/socketProvider";
import { initializeYText } from "@/shared/model/yjs";
import { useCollaborativeCursors } from "./useCollaborativeCursors";
import { getSortedNodes } from "./sortNodes";

export interface YNode extends Node {
  isHolding: boolean;
}

export const useCanvas = () => {
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

  const sortNodes = async () => {
    const sortedNodes = await getSortedNodes(nodes, edges);
    const nodesMap = ydoc.getMap("nodes");

    sortedNodes.forEach((updateNode) => {
      nodesMap.set(updateNode.id, updateNode);
    });

    setNodes(sortedNodes);
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

  return {
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
  };
};
