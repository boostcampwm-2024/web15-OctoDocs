import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useValidateWorkspaceInviteLink } from "@/features/workspace/model/useWorkspaceInvite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const joinQueryClient = new QueryClient();

function JoinWrapper() {
  return (
    <QueryClientProvider client={joinQueryClient}>
      <JoinComponent />
    </QueryClientProvider>
  );
}

export const Route = createFileRoute("/join/")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      workspaceId: search.workspaceId as string,
      token: search.token as string,
    };
  },
  component: JoinWrapper,
});

function JoinComponent() {
  const { workspaceId, token } = Route.useSearch();
  const navigate = useNavigate();
  const { mutate: validateInvite, isPending } =
    useValidateWorkspaceInviteLink();

  useEffect(() => {
    if (!token || !workspaceId) {
      navigate({ to: "/" });
      return;
    }

    validateInvite(token, {
      onSuccess: () => {
        navigate({ to: "/workspace/$workspaceId", params: { workspaceId } });
      },
      onError: () => {
        navigate({ to: "/" });
      },
    });
  }, [token, workspaceId, validateInvite, navigate]);

  if (isPending) {
    return <div>워크스페이스 {workspaceId} 입장 중 ...</div>;
  }

  return null;
}
