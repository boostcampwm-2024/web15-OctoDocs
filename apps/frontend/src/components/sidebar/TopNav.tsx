import VerticalDivider from "@/components/commons/divider/VerticalDivider";
import WorkspaceNav from "@/components/WorkspaceNav";
import LogoBtn from "@/components/LogoBtn";
import ProfileModal from "./ProfileModal";
import workspaceLogo from "@/../public/workspace-logo.svg?url";
import { useState } from "react";

export default function TopNav() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
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
      <WorkspaceNav imageUrl={workspaceLogo} workspaceTitle="프로젝트 Web15" />
    </div>
  );
}
