import * as Y from "yjs";
import { createSocketIOProvider } from "@/shared/api";
import useConnectionStore from "@/shared/model/useConnectionStore";
import { useEffect } from "react";

export const useCanvasConnection = (workspaceId: string) => {
  const { canvas, setProvider, setConnectionStatus } = useConnectionStore();

  useEffect(() => {
    if (canvas.provider) {
      canvas.provider.destroy();
    }

    setConnectionStatus("canvas", "connecting");

    const provider = createSocketIOProvider(
      `flow-room-${workspaceId}`,
      new Y.Doc(),
    );
    setProvider("canvas", provider);

    provider.on(
      "status",
      ({ status }: { status: "connected" | "disconnected" }) => {
        setConnectionStatus("canvas", status);
      },
    );

    return () => {
      provider.doc.destroy();
      provider.destroy();
    };
  }, []);
};
