import { useReactFlow, type XYPosition } from "@xyflow/react";
import * as Y from "yjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { SocketIOProvider } from "y-socket.io";

const CURSOR_COLORS = [
  "#7d7b94",
  "#41c76d",
  "#f86e7e",
  "#f6b8b8",
  "#f7d353",
  "#3b5bf7",
  "#59cbf7",
] as const;

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
  const clientId = useRef<number | null>(null);
  const userColor = useRef(
    CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)],
  );

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
    clientId.current = wsProvider.awareness.clientID;

    wsProvider.awareness.setLocalState({
      cursor: null,
      color: userColor.current,
      clientId: wsProvider.awareness.clientID,
    });

    wsProvider.awareness.on("change", () => {
      const states = new Map(
        Array.from(
          wsProvider.awareness.getStates() as Map<number, AwarenessState>,
        ).filter(
          ([key, state]) => key !== clientId.current && state.cursor !== null,
        ),
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
        color: userColor.current,
        clientId: provider.current.awareness.clientID,
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
