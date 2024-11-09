import VerticalDivider from "@/components/commons/divider/VerticalDivider";
import WorkspaceNav from "@/components/WorkspaceNav";
import LogoBtn from "@/components/LogoBtn";
import Button from "@/components/commons/Button";
import LogoBtn from "@/components/LogoBtn";

import logo from "/logo.png?url";

export default function TopNav() {
  return (
    <div className="flex items-center gap-2">
      <LogoBtn />
      <Button className="select-none">Menu</Button>
      <LogoBtn />
      <VerticalDivider className="h-3" />
      <WorkspaceNav imageUrl={logo} workspaceTitle="프로젝트 Web15" />
    </div>
  );
}
