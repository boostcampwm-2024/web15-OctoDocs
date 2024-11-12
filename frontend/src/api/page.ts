import { JSONContent } from "novel";

import { Get, Post, Delete, Patch } from "@/lib/axios";

export interface Page {
  id: number;
  title: string;
  content: JSONContent;
}

export interface CreatePageRequest {
  title: string;
  content: JSONContent;
  x: number;
  y: number;
}

export interface PageRequest {
  title: string;
  content: JSONContent;
}

export interface PageResponse {
  message: string;
  page: Page;
}

export interface PagesResponse {
  message: string;
  pages: Omit<Page, "content">[];
}

export const getPage = async (id: number) => {
  const url = `/page/${id}`;

  const res = await Get<PageResponse>(url);
  return res.data.page;
};

export const getPages = async () => {
  const url = "/page";

  const res = await Get<PagesResponse>(url);
  return res.data.pages;
};

export const createPage = async (pageData: CreatePageRequest) => {
  const url = `/page`;

  const res = await Post<null, CreatePageRequest>(url, pageData);
  return res.data;
};

export const deletePage = async (id: number) => {
  const url = `/page/${id}`;

  const res = await Delete<null>(url);
  return res.data;
};

export const updatePage = async (id: number, pageData: PageRequest) => {
  const url = `/page/${id}`;

  const res = await Patch<null, PageRequest>(url, pageData);
  return res.data;
};
