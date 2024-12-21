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
import { throttle } from "lodash";

import { calculateBestHandles } from "./calculateHandles";
import { useCollaborativeCursors } from "./useCollaborativeCursors";
import { usePageStore } from "@/entities/page";
import { useWorkspace } from "@/shared/lib";
import { useUserStore } from "@/entities/user";
import { useCanvasConnection } from "./useCanvasConnection";
import useConnectionStore from "@/shared/model/useConnectionStore";

export interface YNode extends Node {
  isHolding: boolean;
}

export const useCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const workspaceId = useWorkspace();
  useCanvasConnection(workspaceId);
  const { canvas } = useConnectionStore();
  const provider = canvas.provider;

  const { cursors, handleMouseMove, handleNodeDrag, handleMouseLeave } =
    useCollaborativeCursors({
      provider,
    });

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
    if (!provider) return;

    const yTitleMap = provider.doc.getMap("title");
    const yEmojiMap = provider.doc.getMap("emoji");
    const nodesMap = provider.doc.getMap("nodes");

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
  }, [provider]);

  useEffect(() => {
    if (!provider) return;

    provider.on("sync", (isSynced: boolean) => {
      if (isSynced) {
        const nodesMap = provider.doc.getMap("nodes");
        const yNodes = Array.from(nodesMap.values()) as YNode[];
        setNodes(yNodes);
      }
    });

    const nodesMap = provider.doc.getMap("nodes");
    const edgesMap = provider.doc.getMap("edges");
    const yEdges = Array.from(edgesMap.values()) as Edge[];
    setEdges(yEdges);

    let rafId: number | null = null;
    const pendingUpdates = new Map<string, YNode>();

    const applyUpdates = () => {
      setNodes((nds) => {
        return nds.map((node) => {
          return pendingUpdates.get(node.id) ?? node;
        });
      });
      rafId = null;
    };

    nodesMap.observe((event) => {
      event.changes.keys.forEach((change, key) => {
        const nodeId = key;

        if (change.action === "add") {
          const addedNode = nodesMap.get(nodeId) as YNode;
          setNodes((nds) => {
            return [...nds, addedNode];
          });
        } else if (change.action === "update") {
          const updatedNode = nodesMap.get(nodeId) as YNode;
          pendingUpdates.set(nodeId, updatedNode);

          if (!rafId) {
            rafId = requestAnimationFrame(applyUpdates);
          }
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
      provider.destroy();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [provider, setNodes, setEdges, workspaceId]);

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      if (!provider) return;
      const nodesMap = provider.doc.getMap("nodes");
      const edgesMap = provider.doc.getMap("edges");

      const updateNodePosition = throttle(
        (node: Node, position: YNode["position"]) => {
          const updatedYNode: YNode = {
            ...node,
            position: position,
            selected: false,
            isHolding: holdingNodeRef.current === node.id,
          };
          nodesMap.set(node.id, updatedYNode);

          const affectedEdges = edges.filter(
            (edge) => edge.source === node.id || edge.target === node.id,
          );

          affectedEdges.forEach((edge) => {
            const sourceNode = nodes.find((n) => n.id === edge.source);
            const targetNode = nodes.find((n) => n.id === edge.target);

            if (sourceNode && targetNode) {
              const bestHandles = calculateBestHandles(sourceNode, targetNode);
              const updatedEdge = {
                ...edge,
                sourceHandle: bestHandles.source,
                targetHandle: bestHandles.target,
              };
              edgesMap.set(edge.id, updatedEdge);
            }
          });
        },
        16,
      );

      changes.forEach((change) => {
        if (change.type === "position" && change.position) {
          const node = nodes.find((n) => n.id === change.id);
          if (node) {
            updateNodePosition(node, change.position);
          }
        }
      });

      onNodesChange(changes);
    },
    [nodes, edges, onNodesChange, provider],
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      if (!provider) return;
      const edgesMap = provider.doc.getMap("edges");

      changes.forEach((change) => {
        if (change.type === "remove") {
          edgesMap.delete(change.id);
        }
      });

      onEdgesChange(changes);
    },
    [onEdgesChange, provider],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target || !provider) return;

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

        provider.doc.getMap("edges").set(newEdge.id, newEdge);
        setEdges((eds) => addEdge(newEdge, eds));
      }
    },
    [setEdges, edges, nodes, provider],
  );

  const onNodeDragStart = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      holdingNodeRef.current = node.id;
    },
    [],
  );

  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (!provider) return;

      if (provider.doc) {
        const nodesMap = provider.doc.getMap("nodes");
        const yNode = nodesMap.get(node.id) as YNode | undefined;
        if (yNode) {
          nodesMap.set(node.id, { ...yNode, isHolding: false });
        }
      }
    },
    [provider],
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
