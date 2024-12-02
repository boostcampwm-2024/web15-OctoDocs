import { usePopover } from "@/shared/model/usePopover";
import { CursorPreview, ProfileForm } from "@/features/canvasTools/ui";

interface ProfilePanelProps {
  color: string;
  clientId: string;
  onColorChange: (color: string) => void;
  onClientIdChange: (clientId: string) => void;
}

export function ProfilePanel({
  color,
  clientId,
  onColorChange,
  onClientIdChange,
}: ProfilePanelProps) {
  const { close } = usePopover();

  const handleSave = () => {
    close();
  };

  return (
    <div className="flex flex-row gap-4 p-4">
      <CursorPreview
        defaultCoors={{ x: 90, y: 80 }}
        clientId={clientId}
        color={color}
      />
      <ProfileForm
        color={color}
        clientId={clientId}
        onColorChange={onColorChange}
        onClientIdChange={onClientIdChange}
        onSave={handleSave}
      />
    </div>
  );
}
