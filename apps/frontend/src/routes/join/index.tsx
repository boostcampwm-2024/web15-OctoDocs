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
    const workspaceId = search.workspaceId as string;
    const token = search.token as string;

    if (!workspaceId || !token) {
      throw new Error("유효한 링크가 아닙니다.");
    }

    return { workspaceId, token };
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
        navigate({
          to: "/workspace/$workspaceId",
          params: { workspaceId },
          replace: true,
        });
      },
      onError: () => {
        navigate({ to: "/" });
      },
    });
  }, [token, workspaceId, validateInvite, navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-2 text-lg font-medium">
          워크스페이스 초대 확인 중
        </div>
        {isPending && (
          <div className="text-sm text-gray-500">
            워크스페이스 {workspaceId} 입장 중...
          </div>
        )}
      </div>
    </div>
  );
}
