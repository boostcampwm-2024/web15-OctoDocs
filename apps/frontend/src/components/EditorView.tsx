import EditorLayout from "./layout/EditorLayout";
import EditorTitle from "./editor/EditorTitle";
import ActiveUser from "./commons/activeUser";
import Editor from "./editor";

import { useEditorView } from "@/hooks/useEditorView";

export default function EditorView() {
  const {
    isLoading,
    page,
    currentPage,
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
