import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getUser, logout } from "../api/authApi";

export const useGetUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      queryClient.setQueryData(["user"], null);
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return logoutMutation;
};
