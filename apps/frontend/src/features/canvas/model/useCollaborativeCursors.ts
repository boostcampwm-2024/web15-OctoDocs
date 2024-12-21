import { useCallback, useEffect, useState } from "react";
import { useReactFlow, type XYPosition } from "@xyflow/react";
import { SocketIOProvider } from "y-socket.io";

import { useUserStore } from "@/entities/user";

export interface AwarenessState {
  cursor: XYPosition | null;
  color: string;
  clientId: string;
}

interface CollaborativeCursorsProps {
  provider: SocketIOProvider | null;
}

export function useCollaborativeCursors({
  provider,
}: CollaborativeCursorsProps) {
  const flowInstance = useReactFlow();
  const [cursors, setCursors] = useState<Map<number, AwarenessState>>(
    new Map(),
  );
  const { currentUser } = useUserStore();
  const { color, clientId } = currentUser;

  useEffect(() => {
    if (!provider) return;

    provider.awareness.setLocalState({
      cursor: null,
      color,
      clientId,
    });

    provider.awareness.on("change", () => {
      const states = new Map(
        Array.from(
          provider.awareness.getStates() as Map<number, AwarenessState>,
        ).filter(
          ([, state]) => state.clientId !== clientId && state.cursor !== null,
        ),
      );
      setCursors(states);
    });
  }, [provider, color, clientId]);

  const updateCursorPosition = useCallback(
    (x: number | null, y: number | null) => {
      if (!provider) return;

      if (!provider.awareness) return;

      const cursor =
        x !== null && y !== null
          ? flowInstance?.screenToFlowPosition({ x, y })
          : null;

      provider.awareness.setLocalState({
        cursor,
        color,
        clientId,
      });
    },
    [flowInstance, color, clientId],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      updateCursorPosition(e.clientX, e.clientY);
    },
    [updateCursorPosition],
  );

  const handleNodeDrag = useCallback(
    (e: React.MouseEvent) => {
      updateCursorPosition(e.clientX, e.clientY);
    },
    [updateCursorPosition],
  );

  const handleMouseLeave = useCallback(() => {
    updateCursorPosition(null, null);
  }, [updateCursorPosition]);

  return {
    cursors,
    handleMouseMove,
    handleNodeDrag,
    handleMouseLeave,
  };
}
