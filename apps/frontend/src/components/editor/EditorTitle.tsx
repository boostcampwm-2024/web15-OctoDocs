import useYDocStore from "@/store/useYDocStore";
import { useYText } from "@/hooks/useYText";
import { useOptimisticUpdatePage } from "@/hooks/usePages";
import { JSONContent } from "novel";

interface EditorTitleProps {
  currentPage: number;
  pageContent: JSONContent;
}

export default function EditorTitle({
  currentPage,
  pageContent,
}: EditorTitleProps) {
  const { ydoc } = useYDocStore();
  const { input, setYText } = useYText(ydoc, currentPage);

  const optimisticUpdatePageMutation = useOptimisticUpdatePage({
    id: currentPage ?? 0,
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYText(e.target.value);

    optimisticUpdatePageMutation.mutate({
      pageData: { title: e.target.value, content: pageContent },
    });
  };

  return (
    <div className="p-12 pb-0">
      <input
        type="text"
        value={input as string}
        className="w-full text-4xl font-bold outline-none"
        onChange={handleTitleChange}
      />
    </div>
  );
}
