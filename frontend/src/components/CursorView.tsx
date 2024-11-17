import { Panel } from "@xyflow/react";
import { useReactFlow } from "@xyflow/react";
import { type AwarenessState } from "@/hooks/useCursor";
import Cursor from "./cursor";

interface CollaborativeCursorsProps {
  cursors: Map<number, AwarenessState>;
}

export function CollaborativeCursors({ cursors }: CollaborativeCursorsProps) {
  const { flowToScreenPosition } = useReactFlow();

  return (
    <Panel position="top-left" className="pointer-events-none">
      {Array.from(cursors.values()).map((cursor) => {
        if (!cursor.cursor) return null;

        const position = flowToScreenPosition({
          x: cursor.cursor.x,
          y: cursor.cursor.y,
        });

        return (
          <Cursor key={cursor.clientId} coors={position} color={cursor.color} />
        );
      })}
    </Panel>
  );
}
