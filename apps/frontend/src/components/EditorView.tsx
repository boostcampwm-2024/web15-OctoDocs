import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";

import Editor from "./editor";
import EditorLayout from "./layout/EditorLayout";
import EditorTitle from "./editor/EditorTitle";
import ActiveUser from "./commons/activeUser";

import usePageStore from "@/store/usePageStore";
import useUserStore from "@/store/useUserStore";
import { usePage } from "@/hooks/usePages";

export default function EditorView() {
  const { currentPage } = usePageStore();
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

    const wsProvider = new SocketIOProvider(
      import.meta.env.VITE_WS_URL,
      `document-${currentPage}`,
      doc,
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

  if (isLoading || !page || currentPage === null) {
    return null;
  }

  if (!ydoc || !provider) return null;

  return (
    <EditorLayout saveStatus={saveStatus}>
      <EditorTitle
        key={currentPage}
        currentPage={currentPage}
        pageContent={pageContent}
      />
      <ActiveUser
        users={users.filter(
          (user) => user.currentPageId === currentPage.toString(),
        )}
      />
      <Editor
        key={ydoc.guid}
        pageId={currentPage}
        ydoc={ydoc}
        provider={provider}
        onEditorUpdate={handleEditorUpdate}
      />
    </EditorLayout>
  );
}
