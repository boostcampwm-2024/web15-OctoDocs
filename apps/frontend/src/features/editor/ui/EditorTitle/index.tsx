import Picker from "@emoji-mart/react";

import { useEditorTitle } from "../../model/useEditorTitle";
import { Emoji } from "@/shared/ui";
import { cn } from "@/shared/lib";

interface EditorTitleProps {
  currentPage: number;
}

interface Emoji {
  id: string;
  keywords: string[];
  name: string;
  native: string;
  shortcodes: string;
  unified: string;
}

export function EditorTitle({ currentPage }: EditorTitleProps) {
  const {
    emoji,
    title,
    isEmojiPickerOpen,
    handleTitleEmojiClick,
    handleRemoveIconClick,
    handleEmojiClick,
    handleEmojiOutsideClick,
    handleTitleChange,
  } = useEditorTitle(currentPage);

  return (
    <div className="flex flex-col gap-3">
      <div className="group">
        <div className={cn("relative duration-200")}>
          <button onClick={handleTitleEmojiClick}>
            <Emoji
              emoji={emoji}
              width="w-16"
              height="h-16"
              fontSize="text-6xl"
            />
          </button>
          <div
            className={`top-18 absolute z-50 ${isEmojiPickerOpen ? "block" : "hidden"}`}
          >
            <button
              onClick={handleRemoveIconClick}
              className="absolute -top-8 right-0 z-10 rounded-md bg-neutral-50 p-1 px-2 text-sm hover:bg-neutral-200"
            >
              Remove
            </button>
            <Picker
              theme="light"
              previewPosition="none"
              onEmojiSelect={handleEmojiClick}
              onClickOutside={handleEmojiOutsideClick}
            />
          </div>
        </div>
      </div>
      <input
        type="text"
        value={title as string}
        className="w-full text-4xl font-bold outline-none"
        onChange={handleTitleChange}
      />
    </div>
  );
}
