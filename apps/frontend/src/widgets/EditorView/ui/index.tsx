import ActiveUser from "@/components/commons/activeUser";
import { Editor, EditorActionPanel, EditorTitle } from "@/features/editor";

import { cn } from "@/lib/utils";
import { useEditorView } from "../hooks/useEditorView";

export function EditorView() {
  const {
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
  } = useEditorView();

  if (isLoading || !page || currentPage === null) {
    return null;
  }

  if (!ydoc || !provider) return null;

  return (
    <div
      className={cn(
        "absolute right-4 top-4 flex h-[720px] w-[520px] flex-col rounded-lg border bg-white shadow-lg transition-transform duration-100 ease-in-out",
        isPanelOpen ? "transform-none" : "translate-x-full",
        isMaximized ? "right-0 top-0 h-screen w-screen" : "",
      )}
    >
      <EditorActionPanel saveStatus={saveStatus} />
      <div
        className={cn(
          "flex flex-1 flex-col gap-4 overflow-auto px-12 py-4",
          isMaximized && "mx-auto w-[800px] py-4",
        )}
      >
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
      </div>
    </div>
  );
}
