import { useState } from "react";
import { Globe2, Lock, Copy, CheckCheck } from "lucide-react";

import { useCreateWorkspaceInviteLink } from "../../model/workspaceMutations";
import { useCurrentWorkspace } from "../../model/workspaceQuries";
import { useToggleWorkspaceStatus } from "../../model/workspaceMutations";
import { useWorkspaceStatus } from "../../model/useWorkspaceStatus";
import { useGetUser } from "@/features/auth";
import { useWorkspace } from "@/shared/lib";
import { Switch } from "@/shared/ui";

const createFrontendUrl = (apiUrl: string, currentWorkspaceId: string) => {
  const searchParams = new URLSearchParams();
  searchParams.set("workspaceId", currentWorkspaceId);
  searchParams.set("token", new URL(apiUrl).searchParams.get("token") || "");
  return `${window.location.origin}/join?${searchParams.toString()}`;
};

export function SharePanel() {
  const workspaceId = useWorkspace();
  const { isLoading: isUserLoading } = useGetUser();
  const { data: currentWorkspace, isLoading: isWorkspaceLoading } =
    useCurrentWorkspace();
  const workspaceVisibility = useWorkspaceStatus();
  const [copied, setCopied] = useState(false);

  const createInviteLinkMutation = useCreateWorkspaceInviteLink();
  const toggleStatusMutation = useToggleWorkspaceStatus(workspaceVisibility);

  const PUBLIC_URL = window.location.href;

  const isPending =
    isUserLoading ||
    createInviteLinkMutation.isPending ||
    toggleStatusMutation.isPending;

  const isPublic =
    workspaceId === "main" ? true : workspaceVisibility === "public";

  const isGuest =
    workspaceId === "main" || currentWorkspace?.workspace?.role === "guest";

  const handlePublicToggle = async () => {
    if (isGuest) return;
    await toggleStatusMutation.mutateAsync();

    if (isPublic && !createInviteLinkMutation.data) {
      await createInviteLinkMutation.mutateAsync(workspaceId);
    }
  };

  const getCurrentUrl = () => {
    if (isUserLoading || isWorkspaceLoading)
      return "워크스페이스를 불러오는 중...";
    if (isPending) return "처리 중...";
    if (isPublic) return PUBLIC_URL;
    if (createInviteLinkMutation.data) {
      return createFrontendUrl(createInviteLinkMutation.data, workspaceId);
    }
    return "권한이 없습니다";
  };

  const handleCopy = async () => {
    const urlToCopy = getCurrentUrl();
    if (!isPending && !isWorkspaceLoading) {
      await navigator.clipboard.writeText(urlToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isDisabled = isGuest || isPending;

  return (
    <div className="w-full">
      <div className="flex w-full flex-row justify-between p-1">
        <div className="flex flex-row items-center gap-2">
          <div className="flex-row text-sm text-slate-400">공개 범위</div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={isPublic}
              onChange={handlePublicToggle}
              CheckedIcon={Globe2}
              UncheckedIcon={Lock}
              disabled={isDisabled || isUserLoading}
            />
          </div>
        </div>
        <div className="select-none flex-row text-sm text-slate-400">
          {isGuest ? "변경 권한이 없습니다." : ""}
        </div>
      </div>
      <div
        className={`flex w-full items-center justify-between gap-2 py-2 ${
          isGuest ? "opacity-50" : ""
        }`}
      >
        <div className="w-48 flex-1 truncate rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-600">
          {getCurrentUrl()}
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          aria-label="Copy URL"
          disabled={isDisabled || isUserLoading || isWorkspaceLoading}
        >
          {copied ? (
            <CheckCheck className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 text-gray-500" />
          )}
        </button>
      </div>
    </div>
  );
}

export default SharePanel;
