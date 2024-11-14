import { type Tailwindest } from "tailwindest";
import { cn } from "@/lib/utils";

type ScrollWrapperProps = {
  width?: Tailwindest["width"];
  height?: Tailwindest["height"];
  children: React.ReactNode;
  className?: string;
};

export default function ScrollWrapper({
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
