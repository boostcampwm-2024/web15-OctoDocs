import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";

import usePageStore from "@/store/usePageStore";
import useUserStore from "@/store/useUserStore";
import { usePage } from "@/hooks/usePages";
import { createSocketIOProvider } from "@/lib/socketProvider";

export const useEditorView = () => {
  const { currentPage, isPanelOpen, isMaximized } = usePageStore();
  const { page, isLoading } = usePage(currentPage);
  const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved">("saved");
  const [ydoc, setYDoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<SocketIOProvider | null>(null);
  const { users } = useUserStore();

  useEffect(() => {
    if (!currentPage) return;

    if (provider) {
      provider.disconnect();
    }

    const doc = new Y.Doc();
    setYDoc(doc);

    const wsProvider = createSocketIOProvider(`document-${currentPage}`, doc);
    setProvider(wsProvider);

    return () => {
      wsProvider.disconnect();
    };
  }, [currentPage]);

  const pageContent = page?.content ?? {};

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
    isLoading,
    page,
    ydoc,
    provider,
    saveStatus,
    pageContent,
    handleEditorUpdate,
    users,
  };
};
