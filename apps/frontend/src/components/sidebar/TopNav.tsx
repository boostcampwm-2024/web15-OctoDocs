import VerticalDivider from "@/components/commons/divider/VerticalDivider";
import WorkspaceNav from "@/components/WorkspaceNav";
import LogoBtn from "@/components/LogoBtn";
import ProfileModal from "./ProfileModal";
import { useState } from "react";
import { Menu } from "lucide-react";
import { X } from "lucide-react";

interface TopNavProps {
  onExpand: () => void;
  isExpanded: boolean;
}
export default function TopNav({ onExpand, isExpanded }: TopNavProps) {
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
        <VerticalDivider className="h-3" />
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
