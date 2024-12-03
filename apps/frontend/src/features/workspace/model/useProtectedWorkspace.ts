import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCurrentWorkspace } from "@/features/workspace/model/workspaceQuries";

export const useProtectedWorkspace = () => {
  const navigate = useNavigate();
  const { data: workspaceData, isLoading, error } = useCurrentWorkspace();

  useEffect(() => {
    if (!isLoading && (error || !workspaceData)) {
      navigate({ to: "/" });
    }
  }, [isLoading, workspaceData, error, navigate]);

  return {
    isLoading,
    workspaceData,
  };
};
