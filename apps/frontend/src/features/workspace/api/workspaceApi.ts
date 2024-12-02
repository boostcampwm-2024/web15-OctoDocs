import { Delete, Get, Post } from "@/shared/api";
import {
  CreateWorkSpaceResponse,
  CreateWorkSpaceResquest,
  GetCurrentUserWorkspaceResponse,
  GetUserWorkspaceResponse,
  RemoveWorkSpaceResponse,
} from "../model/workspaceTypes";

const BASE_URL = "/api/workspace";

export const createWorkspace = async (payload: CreateWorkSpaceResquest) => {
  const res = await Post<CreateWorkSpaceResponse, CreateWorkSpaceResquest>(
    BASE_URL,
    payload,
  );
  return res.data;
};

export const removeWorkspace = async (workspaceId: string) => {
  const url = `${BASE_URL}/${workspaceId}`;

  const res = await Delete<RemoveWorkSpaceResponse>(url);
  return res.data;
};

// TODO: /entities/user vs workspace 위치 고민해봐야할듯?
export const getUserWorkspaces = async () => {
  const url = `${BASE_URL}/user`;

  const res = await Get<GetUserWorkspaceResponse>(url);
  return res.data;
};

export const getCurrentWorkspace = async (
  workspaceId: string,
  userId: string,
) => {
  const url = `${BASE_URL}/${workspaceId}/${userId}`;

  // Response type 바꾸기
  const res = await Get<GetCurrentUserWorkspaceResponse>(url);
  return res.data;
};
