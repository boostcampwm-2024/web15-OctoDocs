import { Popover } from "@/shared/ui";
import { Sharebutton } from "./ShareButton";
import { SharePanel } from "./SharePanel";
export function ShareTool() {
  return (
    <div className="mr-1">
      <Popover placement="bottom" align="start" offset={{ x: -6, y: 16 }}>
        <Popover.Trigger>
          <Sharebutton />
        </Popover.Trigger>
        <Popover.Content className="rounded-lg border border-neutral-200 bg-white p-2 shadow-md">
          <SharePanel />
        </Popover.Content>
      </Popover>
    </div>
  );
}
