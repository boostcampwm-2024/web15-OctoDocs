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
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { SocketIOProvider } from "y-socket.io";

import { calculateBestHandles } from "./calculateHandles";
import { useCollaborativeCursors } from "./useCollaborativeCursors";
import { usePageStore } from "@/entities/page";
import { createSocketIOProvider } from "@/shared/api";
import { useWorkspace } from "@/shared/lib";
import { useYDocStore } from "@/shared/model";
import { useUserStore } from "@/entities/user";

export interface YNode extends Node {
  isHolding: boolean;
}

export const useCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const workspace = useWorkspace();
  const { ydoc } = useYDocStore();
  const { cursors, handleMouseMove, handleNodeDrag, handleMouseLeave } =
    useCollaborativeCursors({
      ydoc,
    });

  const provider = useRef<SocketIOProvider>();
  const holdingNodeRef = useRef<string | null>(null);

  const { currentPage, setCurrentPage } = usePageStore();
  const { users } = useUserStore();

  const { fitView } = useReactFlow();

  useEffect(() => {
    if (currentPage) {
      setTimeout(() => {
        fitView({
          nodes: [{ id: currentPage.toString() }],
          duration: 500,
          padding: 0.5,
        });
        const nodeElement = document.querySelector(
          `[data-nodeid="${currentPage}"]`,
        ) as HTMLInputElement;
        if (nodeElement) {
          nodeElement.focus();
        }
      }, 100);
    }
  }, [currentPage, fitView]);

  useEffect(() => {
    const yTitleMap = ydoc.getMap("title");
    const yEmojiMap = ydoc.getMap("emoji");
    const nodesMap = ydoc.getMap("nodes");

    yTitleMap.observeDeep((event) => {
      if (!event[0].path.length) return;

      const pageId = event[0].path[0].toString().split("_")[1];
      const value = event[0].target.toString();

      const existingNode = nodesMap.get(pageId) as YNode;
      if (!existingNode) return;

      const newNode: YNode = {
        id: existingNode.id,
        type: "note",
        data: {
          title: value,
          id: pageId,
          emoji: existingNode.data.emoji,
          color: existingNode.data.color,
        },
        position: existingNode.position,
        selected: false,
        isHolding: false,
      };

      nodesMap.set(pageId, newNode);
    });

    yEmojiMap.observeDeep((event) => {
      if (!event[0].path.length) return;

      const pageId = event[0].path[0].toString().split("_")[1];
      const value = event[0].target.toString();

      const existingNode = nodesMap.get(pageId) as YNode;
      if (!existingNode) return;

      const newNode: YNode = {
        id: pageId,
        type: "note",
        data: {
          title: existingNode.data.title,
          id: pageId,
          emoji: value,
          color: existingNode.data.color,
        },
        position: existingNode.position,
        selected: false,
        isHolding: false,
      };

      nodesMap.set(pageId, newNode);
    });
  }, [ydoc]);

  useEffect(() => {
    if (!ydoc) return;

    const wsProvider = createSocketIOProvider(`flow-room-${workspace}`, ydoc);
    provider.current = wsProvider;

    wsProvider.on("sync", (isSynced: boolean) => {
      if (isSynced) {
        const nodesMap = ydoc.getMap("nodes");
        const yNodes = Array.from(nodesMap.values()) as YNode[];
        setNodes(yNodes);
      }
    });

    const nodesMap = ydoc.getMap("nodes");
    const edgesMap = ydoc.getMap("edges");
    const yEdges = Array.from(edgesMap.values()) as Edge[];
    setEdges(yEdges);

    nodesMap.observe((event) => {
      event.changes.keys.forEach((change, key) => {
        const nodeId = key;
        if (change.action === "add" || change.action === "update") {
          const updatedNode = nodesMap.get(nodeId) as YNode;
          setNodes((nds) => {
            const index = nds.findIndex((n) => n.id === nodeId);
            if (index === -1) {
              return [...nds, updatedNode];
            }
            const newNodes = [...nds];
            newNodes[index] = updatedNode;
            return newNodes;
          });
        } else if (change.action === "delete") {
          // parseInt는 yjs.service.ts에서 타입 변환 로직 참고.
          const deletedNodeId = parseInt(nodeId);
          const currentPageValue = usePageStore.getState().currentPage;

          if (currentPageValue === deletedNodeId) {
            setCurrentPage(null);
          }

          setNodes((nds) => nds.filter((n) => n.id !== nodeId));
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
  }, [ydoc, setNodes, setEdges, workspace]);

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
    [nodes, edges, onNodesChange, ydoc],
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
    [onEdgesChange, ydoc],
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

  const handleNodeClick = useCallback((id: number) => {
    setCurrentPage(id);
  }, []);

  return {
    currentPage,
    nodes,
    edges,
    users,
    setCurrentPage,
    handleMouseMove,
    handleNodesChange,
    handleEdgesChange,
    handleMouseLeave,
    handleNodeDrag,
    onNodeDragStart,
    onNodeDragStop,
    onConnect,
    handleNodeClick,
    cursors,
  };
};
