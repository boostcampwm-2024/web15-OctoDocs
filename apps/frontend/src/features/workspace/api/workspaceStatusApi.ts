import { Post } from "@/shared/api";
import { SetWorkspaceStatusResponse } from "../model/workspaceInviteTypes";

export const setWorkspaceStatusToPrivate = async (id: string) => {
  // TODO: URL 맞게 고치기.
  const url = `/api/workspace/${id}/private`;
  await Post<SetWorkspaceStatusResponse, null>(url);
};

export const setWorkspaceStatusToPublic = async (id: string) => {
  // TODO: URL 맞게 고치기.
  const url = `/api/workspace/${id}/public`;
  await Post<SetWorkspaceStatusResponse, null>(url);
};
