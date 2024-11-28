import { useMutation } from "@tanstack/react-query";
import {
  createWorkspaceInviteLink,
  validateWorkspaceInviteLink,
} from "../api/worskspaceInviteApi";

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
