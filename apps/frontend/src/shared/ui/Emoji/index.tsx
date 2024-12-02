import { FileText } from "lucide-react";
import { Tailwindest } from "tailwindest";

import { cn } from "@/shared/lib";

interface EmojiProps {
  emoji: string | null;
  width?: Tailwindest["width"];
  height?: Tailwindest["height"];
  fontSize?: Tailwindest["fontSize"];
}

export default function Emoji({ emoji, width, height, fontSize }: EmojiProps) {
  if (!emoji)
    return (
      <FileText
        className={cn("", width, height)}
        strokeWidth="1.5px"
        color="#91918e"
      />
    );

  return <div className={cn("", width, height, fontSize)}>{emoji}</div>;
}
