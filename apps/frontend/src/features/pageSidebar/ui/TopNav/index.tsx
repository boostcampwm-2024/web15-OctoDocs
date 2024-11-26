import { useState } from "react";
import { Menu, X } from "lucide-react";

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
        <Login
          isOpen={isModalOpen}
          onCloseModal={() => setIsModalOpen(false)}
        />
        <Divider direction="vertical" className="h-3" />
        <WorkspaceNav workspaceTitle="프로젝트 Web15" />
      </div>
      <div className="flex h-7 w-7 items-center justify-center">
        <button onClick={onExpand}>
          {isExpanded ? (
            <X color="#3F3F3F" />
          ) : (
            <Menu size={24} color="#3F3F3F" />
          )}
        </button>
      </div>
    </div>
  );
}
