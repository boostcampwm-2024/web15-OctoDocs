import { Menu, X } from "lucide-react";

import { Divider } from "@/shared/ui";
import { WorkspaceNav } from "@/features/pageSidebar/ui";
import { LogoBtnView } from "@/widgets/LogoBtnView/ui";

interface TopNavProps {
  onExpand: () => void;
  isExpanded: boolean;
}
export function TopNavView({ onExpand, isExpanded }: TopNavProps) {
  return (
    <div className="flex w-full flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-2">
        <LogoBtnView />
        <Divider direction="vertical" className="h-3" />
        <WorkspaceNav workspaceTitle="프로젝트 Web15" />
      </div>
      <div className="flex h-7 w-7 items-center justify-center">
        <button onClick={onExpand}>
          {isExpanded ? (
            <X color="#3F3F3F" />
          ) : (
            <Menu size={24} color="#3F3F3F" />
          )}
        </button>
      </div>
    </div>
  );
}
