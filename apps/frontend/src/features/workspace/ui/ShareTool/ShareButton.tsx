// TODO: admin이 아니라면 tooltip 추가 "권한이 없습니다."

import { useWorkspace } from "@/shared/lib/useWorkspace";
import { useUserWorkspace } from "../../model/useWorkspace";

export function Sharebutton() {
  const currentWorkspaceId = useWorkspace();
  const workspaces = useUserWorkspace();
  const workspace = workspaces?.find(
    (workspace) => workspace.id === currentWorkspaceId,
  );
  const isGuest = workspace?.role === "guest";

  return (
    <div className="flex h-9 items-center justify-center">
      <button
        disabled={isGuest}
        className="rounded-md bg-blue-400 px-2 py-1 text-[#171717] hover:bg-blue-500"
      >
        공유
      </button>
    </div>
  );
}
