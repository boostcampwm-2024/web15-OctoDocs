import { useReactFlow, type XYPosition } from "@xyflow/react";
import * as Y from "yjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { SocketIOProvider } from "y-socket.io";
import useUserStore from "@/store/useUserStore";

export interface AwarenessState {
  cursor: XYPosition | null;
  color: string;
  clientId: number;
}

interface CollaborativeCursorsProps {
  ydoc: Y.Doc;
  roomName?: string;
}

export function useCollaborativeCursors({
  ydoc,
  roomName = "cursor-room",
}: CollaborativeCursorsProps) {
  const flowInstance = useReactFlow();
  const provider = useRef<SocketIOProvider>();
  const [cursors, setCursors] = useState<Map<number, AwarenessState>>(
    new Map(),
  );
  const { currentUser } = useUserStore();

  useEffect(() => {
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

    wsProvider.awareness.setLocalState({
      cursor: null,
      color: currentUser.color,
      clientId: currentUser.clientId,
    });

    wsProvider.awareness.on("change", () => {
      const states = new Map(
        Array.from(
          wsProvider.awareness.getStates() as Map<number, AwarenessState>,
        ).filter(([, state]) => state.cursor !== null),
      );
      setCursors(states);
    });

    return () => {
      wsProvider.destroy();
    };
  }, [ydoc, roomName]);

  const updateCursorPosition = useCallback(
    (x: number | null, y: number | null) => {
      if (!provider.current?.awareness) return;

      const cursor =
        x !== null && y !== null
          ? flowInstance?.screenToFlowPosition({ x, y })
          : null;

      provider.current.awareness.setLocalState({
        cursor,
        color: currentUser.color,
        clientId: currentUser.clientId,
      });
    },
    [flowInstance],
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
