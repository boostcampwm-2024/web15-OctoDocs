import { type Tailwindest } from "tailwindest";

import { cn } from "@/shared/lib";

type ScrollWrapperProps = {
  width?: Tailwindest["width"];
  height?: Tailwindest["height"];
  children: React.ReactNode;
  className?: string;
};

export function ScrollWrapper({
  width,
  height,
  children,
  className,
}: ScrollWrapperProps) {
  return (
    <div className={cn("overflow-auto", width, height, className)}>
      {children}
    </div>
  );
}
