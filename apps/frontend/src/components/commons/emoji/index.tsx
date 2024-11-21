import { cn } from "@/lib/utils";
import { Tailwindest } from "tailwindest";

interface EmojiProps {
  emoji: string;
  width?: Tailwindest["width"];
  height?: Tailwindest["height"];
  fontSize?: Tailwindest["fontSize"];
}

export default function Emoji({ emoji, width, height, fontSize }: EmojiProps) {
  return <div className={cn("", width, height, fontSize)}>{emoji}</div>;
}
