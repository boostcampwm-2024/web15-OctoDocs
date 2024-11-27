import { Get, Post } from "@/shared/api";

interface GetUserResponse {
  message: string;
  user: {
    sub: number;
    exp: number;
    iat: number;
    provider: "kakao" | "naver";
  };
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
