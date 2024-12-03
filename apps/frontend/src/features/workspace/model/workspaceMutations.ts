import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createWorkspace, removeWorkspace } from "../api/workspaceApi";
import {
  setWorkspaceStatusToPrivate,
  setWorkspaceStatusToPublic,
} from "../api/workspaceStatusApi";
import {
  createWorkspaceInviteLink,
  validateWorkspaceInviteLink,
} from "../api/worskspaceInviteApi";
import { useWorkspace } from "@/shared/lib";

// response로 workspaceId가 오는데 userWorkspace를 어떻게 invalidate 할까?
// login state에 있는 userId로?
export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userWorkspace"] });
    },
  });
};

export const useRemoveWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userWorkspace"] });
    },
  });
};

export const useCreateWorkspaceInviteLink = () => {
  return useMutation({
    mutationFn: (id: string) => createWorkspaceInviteLink(id),
  });
};

export const useValidateWorkspaceInviteLink = () => {
  return useMutation({
    mutationFn: (token: string) => validateWorkspaceInviteLink(token),
  });
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
      queryClient.invalidateQueries({ queryKey: ["currentWorkspace"] });
    },
  });
};
