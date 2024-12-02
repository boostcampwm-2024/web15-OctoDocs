import { useQuery } from "@tanstack/react-query";

import { getUserWorkspaces } from "../api/workspaceApi";

export const useUserWorkspace = () => {
  return useQuery({
    queryKey: ["userWorkspace"],
    queryFn: getUserWorkspaces,
  });
};
