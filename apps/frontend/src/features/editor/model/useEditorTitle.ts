import { useState } from "react";
import { JSONContent } from "novel";

import Emoji from "@/components/commons/emoji";

import useYDocStore from "@/store/useYDocStore";
import { useYText } from "@/hooks/useYText";
import { useOptimisticUpdatePage } from "@/features/pageSidebar/api/usePages";

interface Emoji {
  id: string;
  keywords: string[];
  name: string;
  native: string;
  shortcodes: string;
  unified: string;
}

export const useEditorTitle = (
  currentPage: number,
  pageContent: JSONContent,
) => {
  const { ydoc } = useYDocStore();
  const [title, setYTitle] = useYText(ydoc, "title", currentPage);
  const [emoji, setYEmoji] = useYText(ydoc, "emoji", currentPage);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const optimisticUpdatePageMutation = useOptimisticUpdatePage({
    id: currentPage ?? 0,
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYTitle(e.target.value);

    optimisticUpdatePageMutation.mutate({
      pageData: { title: e.target.value, content: pageContent, emoji },
    });
  };

  const handleEmojiClick = ({ native }: Emoji) => {
    setYEmoji(native);

    optimisticUpdatePageMutation.mutate({
      pageData: { title, content: pageContent, emoji: native },
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

  const handleRemoveIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    setYEmoji("");

    optimisticUpdatePageMutation.mutate({
      pageData: { title, content: pageContent, emoji: "" },
    });

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
