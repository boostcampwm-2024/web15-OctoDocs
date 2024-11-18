import { PencilLine } from "lucide-react";

import { useCreatePage, usePages } from "@/hooks/usePages";
import usePageStore from "@/store/usePageStore";
import Button from "../commons/button";

// TODO: 에디터 렌더링할 때 필요한 id 받아오는 방법 수정 해야할듯
export default function Tools() {
  const { setCurrentPage } = usePageStore();
  const { pages } = usePages();
  const createMutation = useCreatePage();

  if (!pages) {
    return <div>로딩중...</div>;
  }

  return (
    <Button
      className="flex flex-row items-center gap-1 rounded-sm px-2 py-1 font-medium hover:bg-neutral-100"
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
