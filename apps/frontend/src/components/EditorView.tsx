import { useEffect, useState } from "react";
import { EditorInstance } from "novel";
import { useDebouncedCallback } from "use-debounce";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";

import Editor from "./editor";
import EditorLayout from "./layout/EditorLayout";
import EditorTitle from "./editor/EditorTitle";
import SaveStatus from "./editor/ui/SaveStatus";
import ActiveUser from "./commons/activeUser";

import usePageStore from "@/store/usePageStore";
import useUserStore from "@/store/useUserStore";
import { usePage, useUpdatePage } from "@/hooks/usePages";

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

  const pageTitle = page?.title ?? "제목없음";
  const pageContent =
    !page?.content || Object.keys(page?.content).length === 0
      ? { type: "doc", content: [{ type: "paragraph" }] }
      : page.content;

  const updatePageMutation = useUpdatePage();
  const handleEditorUpdate = useDebouncedCallback(
    async ({ editor }: { editor: EditorInstance }) => {
      if (currentPage === null) {
        return;
      }

      const json = editor.getJSON();

      setSaveStatus("unsaved");
      updatePageMutation.mutate(
        { id: currentPage, pageData: { title: pageTitle, content: json } },
        {
          onSuccess: () => setSaveStatus("saved"),
          onError: () => setSaveStatus("unsaved"),
        },
      );
    },
    500,
  );

  if (isLoading || !page || currentPage === null) {
    return null;
  }

  if (!ydoc || !provider) return null;

  return (
    <EditorLayout>
      <SaveStatus saveStatus={saveStatus} />
      <EditorTitle
        key={currentPage}
        currentPage={currentPage}
        pageContent={pageContent}
      />
      <ActiveUser
        className="px-12 py-4"
        users={users.filter(
          (user) => user.currentPageId === currentPage.toString(),
        )}
      />
      <Editor
        key={ydoc.guid}
        initialContent={pageContent}
        pageId={currentPage}
        ydoc={ydoc}
        provider={provider}
        onEditorUpdate={handleEditorUpdate}
      />
    </EditorLayout>
  );
}
