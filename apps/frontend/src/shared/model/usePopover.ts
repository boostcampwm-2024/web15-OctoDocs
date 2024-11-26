import { createContext, useContext } from "react";

export type Placement = "top" | "right" | "bottom" | "left";
export type Alignment = "start" | "center" | "end";

export interface Offset {
  x: number;
  y: number;
}

export interface PopoverContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLDivElement>;
  placement: Placement;
  offset: Offset;
  align: Alignment;
}

export const PopoverContext = createContext<PopoverContextType | null>(null);

export function usePopover() {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error("Popover 컨텍스트를 찾을 수 없음.");
  }
  return context;
}
