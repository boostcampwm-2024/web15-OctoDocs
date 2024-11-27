import { useCreatePage } from "@/features/pageSidebar/api/usePages";
import { usePageStore } from "@/features/pageSidebar/model";
import { initializeYText } from "@/shared/model";
import { usePopover } from "@/shared/model/usePopover";
import useYDocStore from "@/shared/model/ydocStore";

export function NewNodePanel() {
  const { close } = usePopover();

  const { setCurrentPage } = usePageStore();
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
        close();
      });
  };

  const nodeMap = ydoc.getMap("nodes");

  const handleNewContainerButtonClick = () => {
    const newNode = {
      id: Math.random().toString(36).substr(2, 9),
      type: "group",
      data: { label: "Group A" },
      position: { x: 100, y: 100 },
      style: { width: 200, height: 200 },
    };

    nodeMap.set(newNode.id, newNode);
  };

  return (
    <div className="flex flex-col gap-0.5 p-0.5 text-sm text-[#171717]">
      <button
        onClick={handleNewPageButtonClick}
        className="w-full rounded-md p-1.5 text-start hover:bg-[#f2f2f2]"
      >
        새 노드 추가
      </button>
      <button
        onClick={handleNewContainerButtonClick}
        className="w-full rounded-md p-1.5 text-start hover:bg-[#f2f2f2]"
      >
        컨테이너 추가
      </button>
    </div>
  );
}
