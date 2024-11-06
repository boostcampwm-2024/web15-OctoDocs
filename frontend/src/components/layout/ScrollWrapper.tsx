import { type Tailwindest } from "tailwindest";
import { cn } from "@/lib/utils";

type ScrollWrapperProps = {
  width?: Tailwindest["width"];
  height?: Tailwindest["height"];
  children: React.ReactNode;
};

export default function ScrollWrapper({
  width,
  height,
  children,
}: ScrollWrapperProps) {
  return <div className={cn("overflow-auto", width, height)}>{children}</div>;
}
