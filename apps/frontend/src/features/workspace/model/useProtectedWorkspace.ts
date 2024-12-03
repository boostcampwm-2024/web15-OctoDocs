import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCurrentWorkspace } from "@/features/workspace/model/workspaceQuries";
import { useGetUser } from "@/features/auth";

export const useProtectedWorkspace = () => {
  const navigate = useNavigate();
  const { isLoading: isUserLoading } = useGetUser();
  const {
    data: workspaceData,
    isLoading: isWorkspaceLoading,
    error,
  } = useCurrentWorkspace();

  useEffect(() => {
    if (!isUserLoading && !isWorkspaceLoading && (error || !workspaceData)) {
      navigate({ to: "/" });
    }
  }, [isUserLoading, isWorkspaceLoading, workspaceData, error, navigate]);

  return {
    isLoading: isUserLoading || isWorkspaceLoading,
    workspaceData,
  };
};
