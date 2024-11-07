import { Get, Post, Patch, Delete } from "@/lib/axios";

export interface NodeRequest {
  title: string;
  x: number;
  y: number;
}

export interface NodeCoors {
  x: number;
  y: number;
}

export const getNodeCoors = async (id: number) => {
  const url = `/node${id}`;

  const res = await Get<NodeCoors>(url);
  return res.data;
};

export const createNode = async (id: number, nodeData: NodeRequest) => {
  const url = `/node/${id}`;

  const res = await Post<null, NodeRequest>(url, nodeData);
  return res.data;
};

export const deleteNode = async (id: number) => {
  const url = `/node/${id}`;

  const res = await Delete<null>(url);
  return res.data;
};

export const updateNode = async (id: number, nodeData: NodeRequest) => {
  const url = `/node/${id}`;

  const res = await Patch<null, NodeRequest>(url, nodeData);
  return res.data;
};
