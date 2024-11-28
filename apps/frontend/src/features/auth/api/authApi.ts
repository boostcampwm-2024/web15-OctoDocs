import { Get, Post } from "@/shared/api";

interface GetUserResponse {
  message: string;
  snowflakeId: string;
}

export const getUser = async () => {
  const url = `/api/auth/profile`;

  const res = await Get<GetUserResponse>(url);
  return res.data;
};

export const logout = async () => {
  const url = "/api/auth/logout";

  await Post(url);
};
