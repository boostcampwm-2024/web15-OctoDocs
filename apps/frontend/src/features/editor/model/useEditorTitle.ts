import { useState } from "react";

import Emoji from "@/shared/ui/Emoji";

import useYDocStore from "@/shared/model/ydocStore";
import { useYText } from "@/shared/model/useYText";

interface Emoji {
  id: string;
  keywords: string[];
  name: string;
  native: string;
  shortcodes: string;
  unified: string;
}

export const useEditorTitle = (currentPage: number) => {
  const { ydoc } = useYDocStore();
  const [title, setYTitle] = useYText(ydoc, "title", currentPage);
  const [emoji, setYEmoji] = useYText(ydoc, "emoji", currentPage);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYTitle(e.target.value);
  };

  const handleEmojiClick = ({ native }: Emoji) => {
    setYEmoji(native);
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
    setIsEmojiPickerOpen(false);
  };

  return {
    emoji,
    title,
    isEmojiPickerOpen,
    handleTitleEmojiClick,
    handleRemoveIconClick,
    handleEmojiClick,
    handleEmojiOutsideClick,
    handleTitleChange,
  };
};
