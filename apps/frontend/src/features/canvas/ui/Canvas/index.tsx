import { useMemo } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  ConnectionMode,
  NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { CollaborativeCursors } from "../CollaborativeCursors";
import { useCanvas } from "../../model/useCanvas";
import { MemoizedGroupNode, NoteNode, NoteNodeType } from "@/entities/node";
import { cn } from "@/shared/lib";

interface CanvasProps {
  className?: string;
}

export function Canvas({ className }: CanvasProps) {
  const {
    currentPage,
    nodes,
    edges,
    users,
    cursors,
    handleNodeClick,
    handleMouseMove,
    handleNodesChange,
    handleEdgesChange,
    handleMouseLeave,
    handleNodeDrag,
    onNodeDragStart,
    onNodeDragStop,
    onConnect,
  } = useCanvas();

  const proOptions = { hideAttribution: true };

  const nodeTypes = useMemo(() => {
    return {
      note: (props: NodeProps<NoteNodeType>) => {
        return (
          <NoteNode
            {...props}
            isClicked={currentPage === props.data.id}
            handleNodeClick={() => handleNodeClick(props.data.id)}
            users={users.filter(
              (user) => user.currentPageId === props.data.id.toString(),
            )}
          />
        );
      },
      group: MemoizedGroupNode,
    };
  }, [users]);

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
          {/* <button onClick={sortNodes}>Sort</button> */}
        </div>
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <CollaborativeCursors cursors={cursors} />
      </ReactFlow>
    </div>
  );
}
