// provider: createSocketIOProvider("users", new Y.Doc()),
import * as Y from "yjs";
import { createSocketIOProvider } from "@/shared/api";
import useConnectionStore from "@/shared/model/useConnectionStore";
import { useEffect } from "react";

export const useUserConnection = () => {
  const { user, setProvider, setConnectionStatus } = useConnectionStore();

  useEffect(() => {
    if (user.provider) {
      user.provider.destroy();
    }

    setConnectionStatus("user", "connecting");

    const provider = createSocketIOProvider("users", new Y.Doc());
    setProvider("user", provider);

    provider.on(
      "status",
      ({ status }: { status: "connected" | "disconnected" }) => {
        setConnectionStatus("user", status);
      },
    );

    return () => {
      provider.doc.destroy();
      provider.destroy();
    };
  }, []);
};
