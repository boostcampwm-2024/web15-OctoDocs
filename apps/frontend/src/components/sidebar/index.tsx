import NoteList from "./NoteList";
import TopNav from "./TopNav";
import Tools from "./Tools";
import { useState } from "react";
import ScrollWrapper from "@/components/layout/ScrollWrapper";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="z-10 flex w-60 flex-col rounded-xl border-[1px] border-neutral-200 bg-white text-black shadow-md">
      <div className="p-2">
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
