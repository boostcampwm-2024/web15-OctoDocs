import { useState } from "react";
import Picker from "@emoji-mart/react";
import { JSONContent } from "novel";

import Emoji from "@/components/commons/emoji";

import useYDocStore from "@/store/useYDocStore";
import { useYText } from "@/hooks/useYText";
// import { useOptimisticUpdatePage } from "@/hooks/usePages";
import { cn } from "@/lib/utils";

interface EditorTitleProps {
  currentPage: number;
  pageContent: JSONContent;
}

interface Emoji {
  id: string;
  keywords: string[];
  name: string;
  native: string;
  shortcodes: string;
  unified: string;
}

export default function EditorTitle({
  currentPage,
  // pageContent,
}: EditorTitleProps) {
  const { ydoc } = useYDocStore();
  const [title, setYTitle] = useYText(ydoc, "title", currentPage);
  const [emoji, setYEmoji] = useYText(ydoc, "emoji", currentPage);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  // const optimisticUpdatePageMutation = useOptimisticUpdatePage({
  //   id: currentPage ?? 0,
  // });

  // title 변경 -> invalidate page -> 새로운 pageContent + YText 타이틀로 update 요청
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYTitle(e.target.value);

    // optimisticUpdatePageMutation.mutate({
    //   pageData: { title: e.target.value, content: pageContent, emoji },
    // });
  };

  const handleEmojiClick = ({ native }: Emoji) => {
    setYEmoji(native);

    // optimisticUpdatePageMutation.mutate({
    //   pageData: { title, content: pageContent, emoji: native },
    // });

    setIsEmojiPickerOpen(false);
  };

  const handleTitleEmojiClick = () => {
    setIsEmojiPickerOpen(!isEmojiPickerOpen);
  };

  const handleEmojiOutsideClick = () => {
    if (!isEmojiPickerOpen) return;

    setIsEmojiPickerOpen(false);
  };

  const handleRemoveIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    setYEmoji("");

    // optimisticUpdatePageMutation.mutate({
    //   pageData: { title, content: pageContent, emoji: "" },
    // });

    setIsEmojiPickerOpen(false);
  };

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
