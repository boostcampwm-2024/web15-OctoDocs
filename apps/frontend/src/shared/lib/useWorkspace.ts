import { useMatches } from "@tanstack/react-router";

export function useWorkspace(): string {
  const matches = useMatches();
  const workspaceMatch = matches.find(
    (match) => match.routeId === "/workspace/$workspaceId",
  );
  const workspaceId = workspaceMatch?.params.workspaceId ?? "main";
  return workspaceId;
}
