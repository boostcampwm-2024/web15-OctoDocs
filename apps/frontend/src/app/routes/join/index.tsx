import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useValidateWorkspaceInviteLink } from "@/features/workspace";

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
    if (!search.workspaceId || !search.token) {
      window.location.href = "/";
      throw new Error("유효한 링크가 아닙니다.");
    }

    return {
      workspaceId: search.workspaceId as string,
      token: search.token as string,
    };
  },
  component: JoinWrapper,
});

function JoinComponent() {
  const rawWorkspaceId = new URLSearchParams(window.location.search).get(
    "workspaceId",
  );
  const { token } = Route.useSearch();
  const { mutate: validateInvite, isPending } =
    useValidateWorkspaceInviteLink();
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (!token || !rawWorkspaceId) {
      window.location.href = "/";
      return;
    }

    validateInvite(String(token), {
      onSuccess: () => {
        setValidated(true);
      },
      onError: () => {
        window.location.href = "/";
      },
    });
  }, [token, rawWorkspaceId, validateInvite]);

  if (validated && rawWorkspaceId) {
    window.location.href = `/workspace/${rawWorkspaceId}`;
    return null;
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-2 text-lg font-medium">
          워크스페이스 초대 확인 중
        </div>
        {isPending && rawWorkspaceId && (
          <div className="text-sm text-gray-500">
            워크스페이스 {rawWorkspaceId} 입장 중...
          </div>
        )}
      </div>
    </div>
  );
}
