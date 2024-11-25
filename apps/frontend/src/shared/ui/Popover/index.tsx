import { useRef, useState } from "react";

import { PopoverContext, Placement, Offset } from "@/shared/model/usePopover";
import { Trigger } from "./Trigger";
import { Content } from "./Content";

interface PopoverProps {
  children: React.ReactNode;
  placement?: Placement;
  offset?: Partial<Offset>;
}

function Popover({
  children,
  placement = "bottom",
  offset = { x: 0, y: 0 },
}: PopoverProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const fullOffset: Offset = {
    x: offset.x ?? 0,
    y: offset.y ?? 0,
  };

  return (
    <PopoverContext.Provider
      value={{
        open,
        setOpen,
        triggerRef,
        placement,
        offset: fullOffset,
      }}
    >
      {children}
    </PopoverContext.Provider>
  );
}

Popover.Trigger = Trigger;
Popover.Content = Content;

export { Popover };
