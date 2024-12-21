import { PencilLine } from "lucide-react";

import { useCreatePage, usePageStore } from "@/entities/page";
import { initializeYText } from "@/shared/model";
import { Button } from "@/shared/ui";
import { useCurrentWorkspace } from "@/features/workspace";
import useConnectionStore from "@/shared/model/useConnectionStore";

export function Tools() {
  const { setCurrentPage } = usePageStore();
  const createMutation = useCreatePage();
  const { data } = useCurrentWorkspace();
  const { canvas } = useConnectionStore();

  return (
    <Button
      className={`flex w-full flex-row items-center gap-1 rounded-sm px-2 py-1 font-medium hover:bg-neutral-100`}
      onClick={() => {
        if (!data || !canvas.provider) return;

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
            workspaceId: data.workspace.workspaceId,
          })
          .then((res) => {
            if (!canvas.provider) return;
            const nodesMap = canvas.provider.doc.getMap("nodes");
            nodesMap.set(res.pageId.toString(), {
              id: res.pageId.toString(),
              type: "note",
              data: {
                title: "제목 없음",
                id: res.pageId,
                emoji: "",
              },
              position: {
                x: Math.random() * 500,
                y: Math.random() * 500,
              },
              selected: false,
              isHolding: false,
            });

            setCurrentPage(res.pageId);

            const yTitleMap = canvas.provider.doc.getMap("title");
            const yEmojiMap = canvas.provider.doc.getMap("emoji");

            initializeYText(yTitleMap, `title_${res.pageId}`, "제목 없음");
            initializeYText(yEmojiMap, `emoji_${res.pageId}`, "");
          });
      }}
    >
      <div>
        <PencilLine width={20} height={20} widths={1} color="#7f796d" />
      </div>
      <div className="text-neutral-600">새 페이지 작성</div>
    </Button>
  );
}
