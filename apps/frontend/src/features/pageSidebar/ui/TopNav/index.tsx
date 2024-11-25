import { useState } from "react";
import { Menu, X } from "lucide-react";

import { ProfileModal } from "../ProfileModal";
import { WorkspaceNav } from "../WorkspaceNav";
import { LogoBtn } from "../LogoBtn";
import { Divider } from "@/shared/ui";

interface TopNavProps {
  onExpand: () => void;
  isExpanded: boolean;
}
export function TopNav({ onExpand, isExpanded }: TopNavProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex w-full flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-2">
        <LogoBtn
          onClick={() => {
            setIsModalOpen(true);
          }}
        />
        <ProfileModal
          isOpen={isModalOpen}
          onCloseModal={() => {
            setIsModalOpen(false);
          }}
          onConfirm={() => {
            setIsModalOpen(false);
          }}
        />
        <Divider direction="vertical" className="h-3" />
        <WorkspaceNav workspaceTitle="프로젝트 Web15" />
      </div>
      <button onClick={onExpand}>
        {isExpanded ? (
          <X color="#3F3F3F" />
        ) : (
          <Menu size={24} color="#3F3F3F" />
        )}
      </button>
    </div>
  );
}
