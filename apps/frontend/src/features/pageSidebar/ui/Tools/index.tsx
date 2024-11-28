import { PencilLine } from "lucide-react";

import Button from "@/shared/ui/Button";

import { useCreatePage, usePages } from "@/features/pageSidebar/api/usePages";
import { usePageStore } from "../../model/pageStore";
import useYDocStore from "@/shared/model/ydocStore";
import { initializeYText } from "@/shared/model";

export function Tools() {
  const { setCurrentPage } = usePageStore();
  const { pages } = usePages();
  const createMutation = useCreatePage();
  const { ydoc } = useYDocStore();

  const handleNewPageButtonClick = () => {
    createMutation
      .mutateAsync({
        title: "제목 없음",
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "" }],
            },
          ],
        },
        x: 0,
        y: 0,
        emoji: null,
      })
      .then((res) => {
        setCurrentPage(res.pageId);

        const yTitleMap = ydoc.getMap("title");
        const yEmojiMap = ydoc.getMap("emoji");

        initializeYText(yTitleMap, `title_${res.pageId}`, "제목 없음");
        initializeYText(yEmojiMap, `emoji_${res.pageId}`, "");
      });
  };

  return (
    <Button
      className={`${!pages && "disabled"} flex w-full flex-row items-center gap-1 rounded-sm px-2 py-1 font-medium hover:bg-neutral-100`}
      onClick={handleNewPageButtonClick}
    >
      <div>
        <PencilLine width={20} height={20} widths={1} color="#7f796d" />
      </div>
      <div className="text-neutral-600">새 페이지 작성</div>
    </Button>
  );
}
