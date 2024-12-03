import {
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelRightClose,
} from "lucide-react";

import { useEditorStore } from "../../model/editorStore";
import SaveStatus from "../SaveStatus";
import { cn } from "@/shared/lib";

interface EditorActionPanelProps {
  saveStatus: "saved" | "unsaved";
}

export function EditorActionPanel({ saveStatus }: EditorActionPanelProps) {
  const { isPanelOpen, togglePanel, isMaximized, toggleMaximized } =
    useEditorStore();

  return (
    <div className="w-full px-4 py-2">
      <div
        className={cn(
          "flex w-full items-center justify-between",
          isMaximized && "mx-auto max-w-[900px]",
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
            className="flex h-6 w-6 !cursor-pointer items-center justify-center rounded-md hover:bg-neutral-200"
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
    </div>
  );
}
