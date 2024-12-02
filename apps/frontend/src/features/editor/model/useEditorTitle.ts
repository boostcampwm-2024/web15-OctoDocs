import { useState } from "react";

import { YNode } from "@/features/canvas";
import { Emoji } from "@/shared/ui";
import { useYDocStore, useYText } from "@/shared/model";

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

    const nodesMap = ydoc.getMap("nodes");
    const existingNode = nodesMap.get(currentPage.toString()) as YNode;

    if (existingNode) {
      const updatedNode = {
        ...existingNode,
        data: {
          ...existingNode.data,
          title: e.target.value,
        },
      };
      nodesMap.set(currentPage.toString(), updatedNode);
    }
  };

  const handleEmojiClick = ({ native }: Emoji) => {
    setYEmoji(native);

    const nodesMap = ydoc.getMap("nodes");
    const existingNode = nodesMap.get(currentPage.toString()) as YNode;

    if (existingNode) {
      const updatedNode = {
        ...existingNode,
        data: {
          ...existingNode.data,
          emoji: native,
        },
      };
      nodesMap.set(currentPage.toString(), updatedNode);
    }

    setIsEmojiPickerOpen(false);
  };

  const handleRemoveIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    setYEmoji("");

    const nodesMap = ydoc.getMap("nodes");
    const existingNode = nodesMap.get(currentPage.toString()) as YNode;

    if (existingNode) {
      const updatedNode = {
        ...existingNode,
        data: {
          ...existingNode.data,
          emoji: "",
        },
      };
      nodesMap.set(currentPage.toString(), updatedNode);
    }

    setIsEmojiPickerOpen(false);
  };

  const handleTitleEmojiClick = () => {
    setIsEmojiPickerOpen(!isEmojiPickerOpen);
  };

  const handleEmojiOutsideClick = () => {
    if (!isEmojiPickerOpen) return;
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
