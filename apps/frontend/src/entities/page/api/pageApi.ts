import { Get, Post, Delete, Patch } from "@/shared/api";
import {
  CreatePageRequest,
  CreatePageResponse,
  GetPageResponse,
  GetPagesResponse,
  UpdatePageRequest,
} from "../model/pageTypes";

export const getPage = async (id: number) => {
  const url = `/api/page/${id}`;

  const res = await Get<GetPageResponse>(url);
  return res.data.page;
};

export const getPages = async () => {
  const url = "/api/page";

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
