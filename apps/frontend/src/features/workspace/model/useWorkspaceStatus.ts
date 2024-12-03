import { useUserWorkspace } from "./workspaceQuries";
import { useWorkspace } from "@/shared/lib";

export const useWorkspaceStatus = () => {
  const { data } = useUserWorkspace();
  const currentWorkspaceId = useWorkspace();

  const workspaces = data?.workspaces;
  return workspaces?.find(
    (workspace) => workspace.workspaceId === currentWorkspaceId,
  )?.visibility;
};
