import { Get, Post, Delete, Patch } from "@/shared/api";
import {
  GetPageResponse,
  GetPagesResponse,
  CreatePageRequest,
  CreatePageResponse,
  UpdatePageRequest,
} from "../model/pageTypes";

export const getPage = async (id: number) => {
  const url = `/api/page/${id}`;

  const res = await Get<GetPageResponse>(url);
  return res.data.page;
};

// TODO: 임시
export const getPages = async (workspaceId: string) => {
  const url = `/api/page/workspace/${workspaceId}`;

  const res = await Get<GetPagesResponse>(url);
  return res.data.pages;
};

export const createPage = async (pageData: CreatePageRequest) => {
  const url = `/api/page`;

  const res = await Post<CreatePageResponse, CreatePageRequest>(url, pageData);
  return res.data;
};

export const deletePage = async (id: number) => {
  const url = `/api/page/${id}`;

  const res = await Delete<null>(url);
  return res.data;
};

export const updatePage = async (id: number, pageData: UpdatePageRequest) => {
  const url = `/api/page/${id}`;

  const res = await Patch<null, UpdatePageRequest>(url, pageData);
  return res.data;
};
