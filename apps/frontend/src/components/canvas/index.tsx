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
  Position,
  NodeChange,
  Edge,
  EdgeChange,
  Connection,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { usePages } from "@/hooks/usePages";
import { NoteNode } from "./NoteNode";
import * as Y from "yjs";
// import { WebsocketProvider } from "y-websocket";
import { SocketIOProvider } from "y-socket.io";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import useYDocStore from "@/store/useYDocStore";

import { useCollaborativeCursors } from "@/hooks/useCursor";
import { CollaborativeCursors } from "../CursorView";

import { getHandlePosition } from "@/lib/getHandlePosition";

const proOptions = { hideAttribution: true };

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

  useEffect(() => {
    if (!pages) return;

    const yMap = ydoc.getMap("title");

    pages.forEach((page) => {
      if (yMap.get(`title_${page.id}`)) return;

      const yText = new Y.Text();
      yText.insert(0, page.title);

      yMap.set(`title_${page.id}`, yText);
    });
  }, [pages]);

  useEffect(() => {
    if (!ydoc) return;

    const wsProvider = new SocketIOProvider(
      import.meta.env.VITE_WS_URL,
      `flow-room`,
      ydoc,
      {
        autoConnect: true,
        disableBc: false,
      },
      {
        reconnectionDelayMax: 10000,
        timeout: 5000,
        transports: ["websocket", "polling"],
      },
    );

    provider.current = wsProvider;

    const nodesMap = ydoc.getMap("nodes");
    const edgesMap = ydoc.getMap("edges");

    const initialNodes = Array.from(nodesMap.values()) as Node[];
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
          const updatedNode = nodesMap.get(nodeId) as Node;

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
      const existingNode = nodesMap.get(pageId) as Node | undefined;

      const newNode = {
        id: pageId,
        type: "note",
        data: { title: page.title, id: page.id },
        position: existingNode?.position || {
          x: Math.random() * 500,
          y: Math.random() * 500,
        },
        selected: false,
      };

      nodesMap.set(pageId, newNode);
      existingPageIds.current.add(pageId);
    });
  }, [pages, ydoc]);

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      if (!ydoc) return;
      const nodesMap = ydoc.getMap("nodes");
      const edgesMap = ydoc.getMap("edges");

      changes.forEach((change) => {
        if (change.type === "position" && change.position) {
          const node = nodes.find((n) => n.id === change.id);
          if (node) {
            const updatedNode = {
              ...node,
              position: change.position,
              selected: false,
            };
            nodesMap.set(change.id, updatedNode);

            edges.forEach((edge) => {
              if (edge.source === change.id || edge.target === change.id) {
                const sourceNode = nodes.find((n) => n.id === edge.source);
                const targetNode = nodes.find((n) => n.id === edge.target);

                if (sourceNode && targetNode) {
                  const handlePositions = [
                    Position.Left,
                    Position.Right,
                    Position.Top,
                    Position.Bottom,
                  ];
                  let shortestDistance = Infinity;
                  let bestHandles = {
                    source: edge.sourceHandle,
                    target: edge.targetHandle,
                  };

                  handlePositions.forEach((sourceHandle) => {
                    handlePositions.forEach((targetHandle) => {
                      const sourcePosition = getHandlePosition(
                        sourceNode,
                        sourceHandle,
                      );
                      const targetPosition = getHandlePosition(
                        targetNode,
                        targetHandle,
                      );
                      const distance = Math.sqrt(
                        Math.pow(sourcePosition.x - targetPosition.x, 2) +
                          Math.pow(sourcePosition.y - targetPosition.y, 2),
                      );

                      if (distance < shortestDistance) {
                        shortestDistance = distance;
                        bestHandles = {
                          source: sourceHandle,
                          target: targetHandle,
                        };
                      }
                    });
                  });

                  const updatedEdge = {
                    ...edge,
                    sourceHandle: bestHandles.source,
                    targetHandle: bestHandles.target,
                  };
                  edgesMap.set(edge.id, updatedEdge);
                }
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
        const handlePositions = [
          Position.Left,
          Position.Right,
          Position.Top,
          Position.Bottom,
        ];
        let shortestDistance = Infinity;
        let closestHandles = {
          source: connection.sourceHandle,
          target: connection.targetHandle,
        };

        handlePositions.forEach((sourceHandle) => {
          handlePositions.forEach((targetHandle) => {
            const sourcePosition = getHandlePosition(sourceNode, sourceHandle);
            const targetPosition = getHandlePosition(targetNode, targetHandle);
            const distance = Math.sqrt(
              Math.pow(sourcePosition.x - targetPosition.x, 2) +
                Math.pow(sourcePosition.y - targetPosition.y, 2),
            );

            if (distance < shortestDistance) {
              shortestDistance = distance;
              closestHandles = { source: sourceHandle, target: targetHandle };
            }
          });
        });

        const newEdge: Edge = {
          id: `e${connection.source}-${connection.target}`,
          source: connection.source,
          target: connection.target,
          sourceHandle: closestHandles.source,
          targetHandle: closestHandles.target,
        };

        ydoc.getMap("edges").set(newEdge.id, newEdge);
        setEdges((eds) => addEdge(newEdge, eds));
      }
    },
    [setEdges, edges, nodes, ydoc],
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
        onConnect={onConnect}
        proOptions={proOptions}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        selectNodesOnDrag={false}
      >
        <Controls />
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
