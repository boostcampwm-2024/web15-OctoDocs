import { cn } from "@/lib/utils";

interface HorizontalDividerProps {
  className?: string;
}

export default function HorizontalDivider({
  className,
}: HorizontalDividerProps) {
  return <div className={cn("bg-divider h-0.5 rounded-sm", className)}></div>;
}
