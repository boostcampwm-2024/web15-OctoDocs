import { CirclePlus } from "lucide-react";

import Button from "@/shared/ui/Button";

interface WorkspaceAddButtonProps {
  onClick: () => void;
}

export function WorkspaceAddButton({ onClick }: WorkspaceAddButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="flex items-center justify-start gap-2 px-2 py-1.5 text-sm text-neutral-500 hover:bg-[#F5F5F5]"
    >
      <CirclePlus width={16} height={16} />
      워크스페이스 추가
    </Button>
  );
}
