import {
  WorkspaceInviteLinkRequest,
  WorkspaceInviteLinkResponse,
  ValidateWorkspaceLinkResponse,
} from "@/features/workspace/model/workspaceInviteTypes";
import { Get, Post } from "@/shared/api";

export const createWorkspaceInviteLink = async (id: string) => {
  const url = `/api/workspace/${id}/invite`;

  const res = await Post<
    WorkspaceInviteLinkResponse,
    WorkspaceInviteLinkRequest
  >(url, { id });

  return res.data.inviteUrl;
};

export const validateWorkspaceInviteLink = async (token: string) => {
  const url = `/api/workspace/join?token=${token}`;
  const res = await Get<ValidateWorkspaceLinkResponse>(url);
  return res.data;
};
