import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCurrentWorkspace } from "@/features/workspace/model/useWorkspace";

export const useProtectedWorkspace = () => {
  const navigate = useNavigate();
  const { data: workspaceData, isLoading } = useCurrentWorkspace();

  useEffect(() => {
    if (!isLoading && !workspaceData) {
      navigate({ to: "/" });
    }
  }, [isLoading, workspaceData, navigate]);

  return {
    isLoading,
    workspaceData,
  };
};
