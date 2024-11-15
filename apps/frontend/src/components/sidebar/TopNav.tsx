import VerticalDivider from "@/components/commons/divider/VerticalDivider";
import WorkspaceNav from "@/components/WorkspaceNav";
import LogoBtn from "@/components/LogoBtn";

import workspaceLogo from "@/../public/workspace-logo.svg?url";

export default function TopNav() {
  return (
    <div className="flex items-center gap-2">
      <LogoBtn />
      <VerticalDivider className="h-3" />
      <WorkspaceNav imageUrl={workspaceLogo} workspaceTitle="프로젝트 Web15" />
    </div>
  );
}
