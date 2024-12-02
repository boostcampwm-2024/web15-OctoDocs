import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";

import { useUserStore } from "@/entities/user";
import { usePageStore } from "@/entities/page";
import { useEditorStore } from "@/features/editor";
import { createSocketIOProvider } from "@/shared/api";

export const useEditorView = () => {
  const { currentPage } = usePageStore();
  const { isPanelOpen, isMaximized, setIsPanelOpen } = useEditorStore();
  const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved">("saved");
  const [ydoc, setYDoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<SocketIOProvider | null>(null);
  const { users } = useUserStore();

  useEffect(() => {
    if (currentPage) return;

    setIsPanelOpen(false);
  }, [currentPage]);

  useEffect(() => {
    if (!currentPage) return;

    if (provider) {
      provider.disconnect();
    }

    const doc = new Y.Doc();
    setYDoc(doc);

    const wsProvider = createSocketIOProvider(`document-${currentPage}`, doc);
    setProvider(wsProvider);
    setIsPanelOpen(true);

    return () => {
      wsProvider.disconnect();
    };
  }, [currentPage]);

  const handleEditorUpdate = useDebouncedCallback(async () => {
    if (currentPage === null) {
      return;
    }

    setSaveStatus("unsaved");
  }, 500);

  return {
    currentPage,
    isPanelOpen,
    isMaximized,
    ydoc,
    provider,
    saveStatus,
    handleEditorUpdate,
    users,
  };
};
