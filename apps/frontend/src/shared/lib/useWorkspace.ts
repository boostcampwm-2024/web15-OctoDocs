import { useMatches } from "@tanstack/react-router";

export function useWorkspace(): string {
  const matches = useMatches();
  const workspaceMatch = matches.find(
    (match) => match.routeId === "/workspace/$workspaceId",
  );
  return workspaceMatch?.params.workspaceId ?? "main";
}
