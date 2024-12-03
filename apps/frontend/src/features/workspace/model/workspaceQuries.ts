import { useQuery } from "@tanstack/react-query";

import { getUserWorkspaces, getCurrentWorkspace } from "../api/workspaceApi";
import { useGetUser } from "@/features/auth";
import { useWorkspace } from "@/shared/lib/useWorkspace";

export const useUserWorkspace = () => {
  return useQuery({
    queryKey: ["userWorkspace"],
    queryFn: getUserWorkspaces,
  });
};

export const useCurrentWorkspace = () => {
  const workspaceId = useWorkspace();
  const { data: user, isError } = useGetUser();

  const snowflakeId = isError ? "null" : (user?.snowflakeId ?? "null");

  return useQuery({
    queryKey: ["currentWorkspace", workspaceId, snowflakeId],
    queryFn: () => getCurrentWorkspace(workspaceId, snowflakeId),
    enabled: Boolean(workspaceId),
    retry: false,
    refetchOnWindowFocus: false,
  });
};
