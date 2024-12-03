import { cn } from "@/shared/lib";

interface ButtonProps {
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function Button({ className, onClick, children }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "select-none rounded-md px-8 py-2 transition-colors",
        className,
      )}
    >
      {children}
    </button>
  );
}
