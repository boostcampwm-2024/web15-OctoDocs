import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createWorkspace,
  getUserWorkspaces,
  removeWorkspace,
} from "../api/workspaceApi";

export const useUserWorkspace = () => {
  return useQuery({
    queryKey: ["userWorkspace"],
    queryFn: getUserWorkspaces,
  });
};

// response로 workspaceId가 오는데 userWorkspace를 어떻게 invalidate 할까?
// login state에 있는 userId로?
export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userWorkspace"] });
    },
  });
};

export const useRemoveWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userWorkspace"] });
    },
  });
};
