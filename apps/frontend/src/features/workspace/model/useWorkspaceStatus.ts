import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  setWorkspaceStatusToPrivate,
  setWorkspaceStatusToPublic,
} from "../api/workspaceStatusApi";
import { useUserWorkspace } from "../model/useWorkspace";
import { useWorkspace } from "@/shared/lib";

export const useWorkspaceStatus = () => {
  const { data } = useUserWorkspace();
  const currentWorkspaceId = useWorkspace();

  const workspaces = data?.workspaces;
  return workspaces?.find(
    (workspace) => workspace.workspaceId === currentWorkspaceId,
  )?.visibility;
};

export const useToggleWorkspaceStatus = (
  currentStatus: "public" | "private" | undefined,
) => {
  const queryClient = useQueryClient();
  const currentWorkspaceId = useWorkspace();

  return useMutation({
    mutationFn: () => {
      if (currentStatus === undefined) {
        throw new Error("Workspace status is undefined");
      }

      const toggleFn =
        currentStatus === "public"
          ? setWorkspaceStatusToPrivate
          : setWorkspaceStatusToPublic;

      return toggleFn(currentWorkspaceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userWorkspace"] });
    },
  });
};
