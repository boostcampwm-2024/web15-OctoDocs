import { PencilLine } from "lucide-react";

import Button from "@/components/commons/button";

import { useCreatePage, usePages } from "@/features/pageSidebar/api/usePages";
import { usePageStore } from "../../model/pageStore";

export function Tools() {
  const { setCurrentPage } = usePageStore();
  const { pages } = usePages();
  const createMutation = useCreatePage();

  return (
    <Button
      className={`${!pages && "disabled"} flex w-full flex-row items-center gap-1 rounded-sm px-2 py-1 font-medium hover:bg-neutral-100`}
      onClick={() => {
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
          .then((res) => setCurrentPage(res.pageId));
      }}
    >
      <div>
        <PencilLine width={20} height={20} widths={1} color="#7f796d" />
      </div>
      <div className="text-neutral-600">새 페이지 작성</div>
    </Button>
  );
}
