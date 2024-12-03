import { SetWorkspaceStatusResponse } from "../model/workspaceInviteTypes";
import { Patch } from "@/shared/api";

export const setWorkspaceStatusToPrivate = async (id: string) => {
  const url = `/api/workspace/${id}/private`;
  await Patch<SetWorkspaceStatusResponse, null>(url);
};

export const setWorkspaceStatusToPublic = async (id: string) => {
  const url = `/api/workspace/${id}/public`;
  await Patch<SetWorkspaceStatusResponse, null>(url);
};
