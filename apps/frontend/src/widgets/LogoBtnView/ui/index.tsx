import { LoginForm } from "@/features/login/ui";
import { LogoBtn } from "@/features/pageSidebar/ui";
import { Popover } from "@/shared/ui";

export function LogoBtnView() {
  return (
    <div className="flex flex-row items-center gap-2">
      <Popover align="start" offset={{ x: -7, y: 16 }}>
        <Popover.Trigger>
          <LogoBtn />
        </Popover.Trigger>
        <Popover.Content className="rounded-lg border border-neutral-200 bg-white p-8 shadow-md">
          <LoginForm />
        </Popover.Content>
      </Popover>
    </div>
  );
}
