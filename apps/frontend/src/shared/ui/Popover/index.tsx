import { useRef, useState } from "react";
import { Content } from "./Content";
import { Trigger } from "./Trigger";
import {
  PopoverContext,
  Placement,
  Offset,
  Alignment,
} from "@/shared/model/usePopover";

interface PopoverProps {
  children: React.ReactNode;
  placement?: Placement;
  offset?: Partial<Offset>;
  align?: Alignment;
}

function Popover({
  children,
  placement = "bottom",
  align = "center",
  offset = { x: 0, y: 0 },
}: PopoverProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const fullOffset: Offset = {
    x: offset.x ?? 0,
    y: offset.y ?? 0,
  };

  const close = () => setOpen(false);

  return (
    <PopoverContext.Provider
      value={{
        open,
        setOpen,
        triggerRef,
        placement,
        offset: fullOffset,
        align,
        close,
      }}
    >
      {children}
    </PopoverContext.Provider>
  );
}

Popover.Trigger = Trigger;
Popover.Content = Content;

export { Popover };
