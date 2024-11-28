import { Delete, Get, Post } from "@/shared/api";
import {
  CreateWorkSpaceResponse,
  CreateWorkSpaceResquest,
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
export const getUserWorkspaces = async (userId: string) => {
  const url = `${BASE_URL}/${userId}`;

  const res = await Get<GetUserWorkspaceResponse>(url);
  return res.data;
};
