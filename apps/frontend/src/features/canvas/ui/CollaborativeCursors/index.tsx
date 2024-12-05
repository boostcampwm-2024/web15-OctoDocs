import { useMemo } from "react";
import { Panel } from "@xyflow/react";
import { useReactFlow } from "@xyflow/react";

import { AwarenessState } from "../../model/useCollaborativeCursors";
import { useUserStore } from "@/entities/user";
import { Cursor } from "@/shared/ui";

interface CollaborativeCursorsProps {
  cursors: Map<number, AwarenessState>;
}

export function CollaborativeCursors({ cursors }: CollaborativeCursorsProps) {
  const { flowToScreenPosition } = useReactFlow();
  const { currentUser } = useUserStore();
  const validCursors = useMemo(() => {
    const filteredCursors = Array.from(cursors.values()).filter(
      (cursor) =>
        cursor.cursor &&
        (cursor.clientId as unknown as string) !== currentUser.clientId,
    );

    const uniqueCursors = filteredCursors.reduce((acc, current) => {
      const exists = acc.find((item) => item.clientId === current.clientId);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, [] as AwarenessState[]);

    return uniqueCursors;
  }, [cursors]);

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
          clientId={cursor.clientId.toString()}
        />
      ))}
    </Panel>
  );
}
