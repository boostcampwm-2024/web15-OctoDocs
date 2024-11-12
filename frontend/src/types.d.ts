import { type LucideIcon } from "lucide-react";

declare global {
  type SelectorItem = {
    name: string;
    icon: LucideIcon;
    command: (
      editor: NonNullable<ReturnType<typeof useEditor>["editor"]>,
    ) => void;
    isActive: (
      editor: NonNullable<ReturnType<typeof useEditor>["editor"]>,
    ) => boolean;
  };
}
