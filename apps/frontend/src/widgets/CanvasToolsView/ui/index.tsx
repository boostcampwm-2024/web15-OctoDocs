import { useEffect, useState } from "react";

import { Popover } from "@/shared/ui";
import { CursorButton } from "@/features/canvasTools/ui";
import { ShareTool } from "@/features/workspace/ui/ShareTool";
import { ProfilePanel } from "@/features/canvasTools/ui";
import { useUserStore } from "@/entities/user";

export function CanvasToolsView() {
  const { currentUser } = useUserStore();
  const [color, setColor] = useState(currentUser.color);
  const [clientId, setClientId] = useState(currentUser.clientId);

  useEffect(() => {
    setColor(currentUser.color);
    setClientId(currentUser.clientId);
  }, [currentUser]);

  return (
    <div className="z-10 flex flex-row rounded-xl border-[1px] border-neutral-200 bg-white p-1.5 text-black shadow-md">
      <ShareTool />
      <Popover placement="bottom" align="start" offset={{ x: -6, y: 16 }}>
        <Popover.Trigger>
          <CursorButton color={color} />
        </Popover.Trigger>
        <Popover.Content className="rounded-lg border border-neutral-200 bg-white p-2 shadow-md">
          <ProfilePanel
            color={color}
            clientId={clientId}
            onColorChange={setColor}
            onClientIdChange={setClientId}
          />
        </Popover.Content>
      </Popover>
    </div>
  );
}
