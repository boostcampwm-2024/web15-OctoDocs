import { usePageStore } from "@/entities/page";
import { NodePanel } from "@/features/canvasTools/ui/NodePanel";

export function NodeToolsView() {
  const { currentPage } = usePageStore();

  if (!currentPage) return null;

  return (
    <div className="z-10 flex flex-row rounded-xl border-[1px] border-neutral-200 bg-white p-2.5 text-black shadow-md">
      <NodePanel currentPage={currentPage.toString()} />
    </div>
  );
}
