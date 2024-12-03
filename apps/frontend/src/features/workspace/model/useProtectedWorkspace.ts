import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

import { useCurrentWorkspace } from "../model/workspaceQuries";

export const useProtectedWorkspace = () => {
  const navigate = useNavigate();
  const {
    data: workspaceData,
    isLoading: isWorkspaceLoading,
    error,
  } = useCurrentWorkspace();

  useEffect(() => {
    if (!isWorkspaceLoading && (error || !workspaceData)) {
      navigate({ to: "/" });
    }
  }, [isWorkspaceLoading, workspaceData, error, navigate]);

  return {
    isLoading: isWorkspaceLoading,
    workspaceData,
  };
};
