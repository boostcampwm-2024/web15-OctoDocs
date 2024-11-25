import { useState } from "react";

import { NoteList, Tools, TopNav } from "@/features/pageSidebar/ui";
import { ScrollWrapper } from "@/shared/ui";

export function PageSideBarView() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="z-10 flex w-64 flex-col rounded-xl border-[1px] border-neutral-200 bg-white text-black shadow-md">
      <div className="p-4">
        <TopNav onExpand={handleExpand} isExpanded={isExpanded} />
      </div>
      <div className={`${isExpanded ? "flex flex-col" : "hidden"} gap-3 pb-4`}>
        <div className="w-full px-4">
          <Tools />
        </div>
        <ScrollWrapper className="max-h-[604px] overflow-x-clip scrollbar scrollbar-track-transparent scrollbar-thumb-[#d9d9d9]">
          <NoteList className="p-4 pb-0 pt-0" />
        </ScrollWrapper>
      </div>
    </div>
  );
}
