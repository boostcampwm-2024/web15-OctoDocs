import { useQuery } from "@tanstack/react-query";

import { getUser } from "../api/authApi";

export const useGetUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
