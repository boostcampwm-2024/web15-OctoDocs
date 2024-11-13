import usePageStore from "@/store/usePageStore";
import Editor from "./editor";
import {
  usePage,
  useUpdatePage,
  useOptimisticUpdatePage,
} from "@/hooks/usePages";
import EditorLayout from "./layout/EditorLayout";
import EditorTitle from "./editor/EditorTitle";
import { EditorInstance } from "novel";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";
import SaveStatus from "./editor/ui/SaveStatus";

export default function EditorView() {
  const { currentPage } = usePageStore();
  const { page, isLoading } = usePage(currentPage);
  const [editorKey, setEditorKey] = useState(0);
  const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved">("saved");

  const ydoc = useRef<Y.Doc>();
  const provider = useRef<WebsocketProvider>();

  useEffect(() => {
    if (currentPage === null) return;

    if (provider.current) {
      provider.current.disconnect();
      provider.current.destroy();
    }
    if (ydoc.current) {
      ydoc.current.destroy();
    }

    const doc = new Y.Doc();
    const wsProvider = new WebsocketProvider(
      "ws://localhost:1234",
      `document-${currentPage}`,
      doc,
    );

    ydoc.current = doc;
    provider.current = wsProvider;

    setEditorKey((prev) => prev + 1);

    return () => {
      wsProvider.disconnect();
      wsProvider.destroy();
      doc.destroy();
    };
  }, [currentPage]);

  const pageTitle = page?.title ?? "제목없음";
  const pageContent = page?.content ?? {};

  const updatePageMutation = useUpdatePage();
  const optimisticUpdatePageMutation = useOptimisticUpdatePage({
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
  };

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
    return (
      <div>
        {isLoading && <div>"isLoading"</div>}
        {!page && <div>"!page"</div>}
        {currentPage === null && <div>"currrentPage === null"</div>}
      </div>
    );
  }

  if (!ydoc.current || !provider.current) return <div>로딩중</div>;

  return (
    <EditorLayout>
      <SaveStatus saveStatus={saveStatus} />
      <EditorTitle title={pageTitle} onTitleChange={handleTitleChange} />
      <Editor
        key={editorKey}
        initialContent={pageContent}
        pageId={currentPage}
        ydoc={ydoc.current}
        provider={provider.current}
        onEditorUpdate={handleEditorUpdate}
      />
    </EditorLayout>
  );
}
