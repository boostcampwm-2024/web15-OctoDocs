import { MousePointer } from "@/shared/ui";

interface CursorButtonProps {
  color: string;
}

export function CursorButton({ color }: CursorButtonProps) {
  return (
    <button className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-[#F5F5F5]">
      <MousePointer fill={color} className="h-6 w-6" />
    </button>
  );
}
