import { useMutation, useQueryClient } from "@tanstack/react-query";

import { logout } from "../api/authApi";

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
