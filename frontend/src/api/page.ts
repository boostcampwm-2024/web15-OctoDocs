import { JSONContent } from "novel";

import { Get, Post, Delete, Patch } from "@/lib/axios";

export type Page = {
  id: number;
  title: string;
  content: JSONContent;
};

export type PageRequest = {
  title: string;
  content: JSONContent;
};

export const getPages = async () => {
  const url = "/page";

  const res = await Get<Page[]>(url);
  return res.data;
};

export const createPage = async (id: number, pageData: PageRequest) => {
  const url = `/page/${id}`;

  const res = await Post<null, PageRequest>(url, pageData);
  return res.data;
};

export const deletePage = async (id: number) => {
  const url = `/page/${id}`;

  const res = await Delete<null>(url);
  return res.data;
};

export const updatePage = async (id: number, pageData: JSONContent) => {
  const url = `/page/${id}`;

  const res = await Patch<null, JSONContent>(url, pageData);
  return res.data;
};
