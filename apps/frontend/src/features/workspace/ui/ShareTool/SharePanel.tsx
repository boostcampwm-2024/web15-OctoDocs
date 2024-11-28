import { Switch } from "@/shared/ui/Switch";
import { Globe2, Lock, Copy, CheckCheck } from "lucide-react";
import { useState, useEffect } from "react";
import {
  useWorkspaceStatus,
  useToggleWorkspaceStatus,
} from "@/features/workspace/model/useWorkspaceStatus";
import { useCreateWorkspaceInviteLink } from "@/features/workspace/model/useWorkspaceInvite";
import { useWorkspace } from "@/shared/lib/useWorkspace";
import { useInviteLinkStore } from "@/features/workspace/model/useInviteLinkStore";

const createFrontendUrl = (apiUrl: string, currentWorkspaceId: string) => {
  const searchParams = new URLSearchParams();

  searchParams.set("workspaceId", currentWorkspaceId);
  searchParams.set("token", new URL(apiUrl).searchParams.get("token") || "");
  return `${window.location.origin}/join?${searchParams.toString()}`;
};

export function SharePanel() {
  const [copied, setCopied] = useState(false);
  const currentWorkspaceId = useWorkspace();
  const workspaceStatus = useWorkspaceStatus();

  const { inviteLink, setInviteLink } = useInviteLinkStore();

  const { mutate: toggleStatus, isPending: isTogglingStatus } =
    useToggleWorkspaceStatus(workspaceStatus);
  const { mutate: createLink, isPending: isCreatingLink } =
    useCreateWorkspaceInviteLink();

  const isPublic = workspaceStatus === "public";
  const isLoading = isTogglingStatus || isCreatingLink;

  useEffect(() => {
    if (isPublic) {
      setInviteLink(window.location.href);
    } else if (!inviteLink && currentWorkspaceId) {
      createLink(currentWorkspaceId, {
        onSuccess: (inviteUrl) => {
          const frontendUrl = createFrontendUrl(inviteUrl, currentWorkspaceId);
          setInviteLink(frontendUrl);
        },
      });
    }
  }, [isPublic, currentWorkspaceId]);

  const handleCopy = async () => {
    const linkToCopy = isPublic ? window.location.href : inviteLink;
    if (!linkToCopy) return;

    await navigator.clipboard.writeText(linkToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwitchChange = () => {
    toggleStatus();
  };

  const displayedLink = isPublic ? window.location.href : inviteLink;

  return (
    <div className="w-full">
      <div className="flex w-full items-center gap-2 p-1">
        <div className="flex-row text-sm text-slate-400">공개 범위</div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={isPublic}
            onChange={handleSwitchChange}
            CheckedIcon={Globe2}
            UncheckedIcon={Lock}
          />
        </div>
      </div>
      <div
        className={`flex w-full items-center justify-between gap-2 py-2 ${
          !isPublic ? "opacity-50" : ""
        }`}
      >
        <div className="w-48 flex-1 truncate rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-600">
          {isLoading ? "링크 생성 중..." : displayedLink}
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          aria-label="Copy URL"
          disabled={isLoading || !displayedLink}
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
