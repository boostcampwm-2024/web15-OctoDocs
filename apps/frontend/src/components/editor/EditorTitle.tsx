import { useState } from "react";
import Picker from "@emoji-mart/react";
import { JSONContent } from "novel";

import Emoji from "@/components/commons/emoji";

import useYDocStore from "@/store/useYDocStore";
import { useYText } from "@/hooks/useYText";
import { useOptimisticUpdatePage } from "@/hooks/usePages";

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
  pageContent,
}: EditorTitleProps) {
  const { ydoc } = useYDocStore();
  const [title, setYTitle] = useYText(ydoc, "title", currentPage);
  const [emoji, setYEmoji] = useYText(ydoc, "emoji", currentPage);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const optimisticUpdatePageMutation = useOptimisticUpdatePage({
    id: currentPage ?? 0,
  });

  // title 변경 -> invalidate page -> 새로운 pageContent + YText 타이틀로 update 요청
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYTitle(e.target.value);

    optimisticUpdatePageMutation.mutate({
      pageData: { title: e.target.value, content: pageContent, emoji },
    });
  };

  const handleEmojiClick = (emoji: Emoji) => {
    setYEmoji(emoji.native);

    optimisticUpdatePageMutation.mutate({
      pageData: { title, content: pageContent, emoji: emoji.native },
    });

    setIsEmojiPickerOpen(false);
  };

  const handleTitleEmojiClick = () => {
    setIsEmojiPickerOpen(!isEmojiPickerOpen);
  };

  const handleEmojiOutsideClick = () => {
    if (!isEmojiPickerOpen) return;

    setIsEmojiPickerOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <button onClick={handleTitleEmojiClick}>
          <Emoji emoji={emoji} width="w-10" height="h-10" fontSize="text-6xl" />
        </button>
        <div
          className={`top-18 absolute z-50 ${isEmojiPickerOpen ? "block" : "hidden"}`}
        >
          <Picker
            theme="light"
            previewPosition="none"
            onEmojiSelect={handleEmojiClick}
            onClickOutside={handleEmojiOutsideClick}
          />
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
