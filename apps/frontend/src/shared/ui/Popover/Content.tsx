import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { getPosition, usePopover } from "@/shared/model";
import { cn } from "@/shared/lib";

interface ContentProps {
  children: React.ReactNode;
  className?: string;
}

export function Content({ children, className }: ContentProps) {
  const { open, setOpen, triggerRef, placement, offset, align } = usePopover();
  const contentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (open && triggerRef.current && contentRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      const newPosition = getPosition(
        triggerRect,
        contentRect,
        placement,
        offset,
        align,
      );
      setPosition(newPosition);
    }
  }, [open, placement, offset, align, triggerRef]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        !contentRef.current?.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [setOpen, triggerRef]);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      className={cn("fixed z-50", className)}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {children}
    </div>
  );
}
