import { Panel } from "@xyflow/react";
import { useReactFlow } from "@xyflow/react";
import { type AwarenessState } from "@/hooks/useCursor";
import Cursor from "./cursor";
import { useMemo } from "react";

interface CollaborativeCursorsProps {
  cursors: Map<number, AwarenessState>;
}

export function CollaborativeCursors({ cursors }: CollaborativeCursorsProps) {
  const { flowToScreenPosition } = useReactFlow();

  const validCursors = useMemo(
    () => Array.from(cursors.values()).filter((cursor) => cursor.cursor),
    [cursors],
  );

  return (
    <Panel>
      {validCursors.map((cursor) => (
        <Cursor
          key={cursor.clientId}
          coors={flowToScreenPosition({
            x: cursor.cursor!.x,
            y: cursor.cursor!.y,
          })}
          color={cursor.color}
        />
      ))}
    </Panel>
  );
}
