import { Menu, X } from "lucide-react";

import { WorkspaceNav } from "@/features/pageSidebar";
import { UserInfoView } from "@/widgets/UserInfoView";
import { Divider } from "@/shared/ui";

interface TopNavProps {
  onExpand: () => void;
  isExpanded: boolean;
}
export function TopNavView({ onExpand, isExpanded }: TopNavProps) {
  /*   const workspace = useWorkspace();
  const { data } = useUserWorkspace(); */

  /* const getWorkspaceTitle = () => {
    if (!workspace) return "공용 워크스페이스";

    return (
      data?.workspaces.find((w) => w.workspaceId === workspace)?.title ??
      "로딩 중..."
    );
  }; */

  return (
    <div className="flex w-full flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-2">
        <UserInfoView />
        <Divider direction="vertical" className="h-3" />
        <WorkspaceNav />
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
