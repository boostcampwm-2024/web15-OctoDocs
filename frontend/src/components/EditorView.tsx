import usePageStore from "@/store/usePageStore";
import Editor from "./editor";
import { usePage } from "@/hooks/usePages";

export default function EditorView() {
  const { currentPage } = usePageStore();
  const { page } = usePage(currentPage);

  if (!page) {
    return <div></div>;
  }

  return (
    <Editor key={page.id} initialContent={page.content} pageId={page.id} />
  );
}
