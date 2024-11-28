import { LogOut } from "lucide-react";

import Button from "@/shared/ui/Button";
import { useLogout } from "../../model/useAuth";
import { usePopover } from "@/shared/model/usePopover";

export function Logout() {
  const logoutMutation = useLogout();
  const { setOpen } = usePopover();

  const handleButtonClick = () => {
    setOpen(false);
    logoutMutation.mutate();
  };

  return (
    <Button
      onClick={handleButtonClick}
      className="flex items-center gap-2 px-2 py-1.5 text-sm text-neutral-500 hover:bg-[#F5F5F5]"
    >
      <LogOut width={16} height={16} />
      로그아웃
    </Button>
  );
}
