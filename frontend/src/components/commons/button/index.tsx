import { cn } from "@/lib/utils";

interface ButtonProps {
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function Button({ className, onClick, children }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-md px-6 py-2 shadow-md transition-colors",
        className,
      )}
    >
      {children}
    </button>
  );
}
