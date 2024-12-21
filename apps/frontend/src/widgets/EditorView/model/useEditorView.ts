import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { useUserStore } from "@/entities/user";
import { usePageStore } from "@/entities/page";
import { useEditorStore } from "@/features/editor";
import useConnectionStore from "@/shared/model/useConnectionStore";
import { useEdtorConnection } from "@/features/editor/model/useEditorConnection";

export const useEditorView = () => {
  const { currentPage } = usePageStore();
  const { isPanelOpen, isMaximized, setIsPanelOpen } = useEditorStore();
  const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved">("saved");
  useEdtorConnection(currentPage);
  const { editor } = useConnectionStore();
  const { users } = useUserStore();

  useEffect(() => {
    if (currentPage) return;
    setIsPanelOpen(false);
  }, [currentPage]);

  useEffect(() => {
    if (!currentPage) return;
    setIsPanelOpen(true);
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
    ydoc: editor.provider?.doc,
    provider: editor.provider,
    saveStatus,
    handleEditorUpdate,
    users,
  };
};
