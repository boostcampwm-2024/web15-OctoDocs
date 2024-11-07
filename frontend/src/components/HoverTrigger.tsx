import { cn } from "@/lib/utils";
import { useState } from "react";

interface HoverTriggerProps {
  className?: string;
  children: React.ReactNode;
}

export default function HoverTrigger({
  className,
  children,
}: HoverTriggerProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={cn("h-screen", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={cn(
          "transition-transform",
          isHovered ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {children}
      </div>
    </div>
  );
}
