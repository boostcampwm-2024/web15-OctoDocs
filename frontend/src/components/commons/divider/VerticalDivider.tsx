import { cn } from "@/lib/utils";

interface VerticalDividerProps {
  className?: string;
}

export default function VerticalDivider({ className }: VerticalDividerProps) {
  return <div className={cn("bg-divider w-0.5 rounded-sm", className)}></div>;
}
