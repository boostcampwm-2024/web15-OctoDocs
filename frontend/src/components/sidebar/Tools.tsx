import { PencilLine } from "lucide-react";

export default function Tools() {
  return (
    <button className="flex flex-row items-center gap-1 rounded-sm px-2 py-1 font-medium hover:bg-neutral-100">
      <div>
        <PencilLine width={20} height={20} widths={1} />
      </div>
      <div>새 페이지 작성</div>
    </button>
  );
}
