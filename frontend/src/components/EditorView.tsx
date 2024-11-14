import { useMemo, useState } from "react";
import { EditorInstance } from "novel";
import { useDebouncedCallback } from "use-debounce";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

import Editor from "./editor";
import usePageStore from "@/store/usePageStore";
import { usePage, useUpdatePage } from "@/hooks/usePages";
import EditorLayout from "./layout/EditorLayout";
import EditorTitle from "./editor/EditorTitle";
import SaveStatus from "./editor/ui/SaveStatus";

export default function EditorView() {
  const { currentPage } = usePageStore();
  const { page, isLoading } = usePage(currentPage);
  const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved">("saved");

  const ydoc = useMemo(() => {
    return new Y.Doc();
  }, [currentPage]);

  const provider = useMemo(() => {
    return new WebsocketProvider(
      import.meta.env.VITE_WS_URL,
      `document-${currentPage}`,
      ydoc,
    );
  }, [currentPage]);

  const pageTitle = page?.title ?? "제목없음";
  const pageContent = page?.content ?? {};

  const updatePageMutation = useUpdatePage();
  /*   const optimisticUpdatePageMutation = useOptimisticUpdatePage({
    id: currentPage ?? 0,
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentPage === null) return;

    setSaveStatus("unsaved");

    optimisticUpdatePageMutation.mutate(
      {
        pageData: { title: e.target.value, content: pageContent },
      },
      {
        onSuccess: () => setSaveStatus("saved"),
        onError: () => setSaveStatus("unsaved"),
      },
    );
  }; */

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
