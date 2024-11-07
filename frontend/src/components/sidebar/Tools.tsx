import { PencilLine } from "lucide-react";

import { useCreatePage, usePages } from "@/hooks/usePages";
import usePageStore from "@/store/usePageStore";

// TODO: 에디터 렌더링할 때 필요한 id 받아오는 방법 수정 해야할듯
export default function Tools() {
  const { setCurrentPage } = usePageStore();
  const { data } = usePages();
  const createMutation = useCreatePage();

  if (!data) {
    return <div>로딩중...</div>;
  }

  return (
    <button
      className="flex flex-row items-center gap-1 rounded-sm px-2 py-1 font-medium hover:bg-neutral-100"
      onClick={() => {
        createMutation.mutate({
          title: "제목 없음",
          content: {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "This is page 1" }],
              },
            ],
          },
          x: 0,
          y: 0,
        });
        setCurrentPage(data[data.length - 1].id);
      }}
    >
      <div>
        <PencilLine width={20} height={20} widths={1} />
      </div>
      <div>새 페이지 작성</div>
    </button>
  );
}
