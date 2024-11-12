import usePageStore from "@/store/usePageStore";
import Editor from "./editor";
import { usePage } from "@/hooks/usePages";

export default function EditorView() {
  const { currentPage } = usePageStore();
  const { data } = usePage(currentPage);

  if (!data) {
    return <div></div>;
  }

  return <Editor key={data.id} initialValue={data.content} pageId={data.id} />;
}
