import * as Y from "yjs";
import { createSocketIOProvider } from "@/shared/api";
import useConnectionStore from "@/shared/model/useConnectionStore";
import { useEffect } from "react";

export const useEdtorConnection = (currentPage: number | null) => {
  const { editor, setProvider, setConnectionStatus } = useConnectionStore();

  useEffect(() => {
    if (editor.provider) {
      editor.provider.destroy();
    }

    if (currentPage === null) return;

    setConnectionStatus("editor", "connecting");

    const provider = createSocketIOProvider(
      `document-${currentPage}`,
      new Y.Doc(),
    );
    setProvider("editor", provider);

    provider.on(
      "status",
      ({ status }: { status: "connected" | "disconnected" }) => {
        setConnectionStatus("editor", status);
      },
    );

    return () => {
      provider.doc.destroy();
      provider.destroy();
    };
  }, [currentPage]);
};
