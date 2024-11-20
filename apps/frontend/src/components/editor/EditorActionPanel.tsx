import {
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelRightClose,
} from "lucide-react";

import SaveStatus from "./ui/SaveStatus";
import usePageStore from "@/store/usePageStore";
import { cn } from "@/lib/utils";

interface EditorActionPanelProps {
  saveStatus: "saved" | "unsaved";
}

export default function EditorActionPanel({
  saveStatus,
}: EditorActionPanelProps) {
  const { isPanelOpen, togglePanel, isMaximized, toggleMaximized } =
    usePageStore();

  return (
    <div
      className={cn(
        "mx-auto mb-2 flex items-center justify-between gap-2 p-4",
        isMaximized && "max-w-[900px] px-0",
      )}
    >
      <div className="flex items-center gap-1">
        <button
          onClick={togglePanel}
          className={cn(
            "z-50 flex h-6 w-6 !cursor-pointer items-center justify-center rounded-md hover:bg-neutral-200",
            !isPanelOpen &&
              "absolute -left-8 top-0 h-8 w-8 rounded-l border-b border-l border-t border-[#e0e6ee] bg-[#f5f5f5]",
          )}
        >
          {isPanelOpen ? (
            <PanelRightClose className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
        <button
          onClick={toggleMaximized}
          className="flex h-6 w-6 !cursor-pointer items-center justify-center rounded-md rounded-l border-b border-l border-t border-none hover:bg-neutral-200"
        >
          {isMaximized ? (
            <Minimize2 className="h-4 w-4 rotate-90" />
          ) : (
            <Maximize2 className="h-4 w-4 rotate-90" />
          )}
        </button>
      </div>
      <SaveStatus saveStatus={saveStatus} />
    </div>
  );
}
