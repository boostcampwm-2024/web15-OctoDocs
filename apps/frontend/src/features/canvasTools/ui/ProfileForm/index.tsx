import { RefreshCcw } from "lucide-react";

import { useUserStore } from "@/entities/user";
import { getRandomColor } from "@/shared/lib";
import { FormField } from "@/shared/ui";

interface ProfileFormProps {
  color: string;
  clientId: string;
  onColorChange: (color: string) => void;
  onClientIdChange: (clientId: string) => void;
  onSave: () => void;
}

export function ProfileForm({
  color,
  clientId,
  onColorChange,
  onClientIdChange,
  onSave,
}: ProfileFormProps) {
  const { currentUser, setCurrentUser, provider } = useUserStore();

  const handleRefreshClick = () => {
    const newColor = getRandomColor();
    onColorChange(newColor);
  };

  const handleColorInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isValidHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (isValidHex.test(e.target.value)) {
      onColorChange(e.target.value);
    }
    onColorChange(e.target.value);
  };

  const handleSave = () => {
    provider.awareness.setLocalStateField("color", color);
    provider.awareness.setLocalStateField("clientId", clientId);

    setCurrentUser({
      ...currentUser,
      color,
      clientId,
    });

    onSave();
  };

  return (
    <div className="flex w-36 flex-col justify-between">
      <div className="flex flex-col gap-2">
        <FormField
          label="프로필"
          input={
            <input
              value={clientId}
              onChange={(e) => onClientIdChange(e.target.value)}
              className="h-8 rounded-md border-[1px] border-[#d0d9e0] bg-[#f5f6fa] px-2"
              placeholder="닉네임을 입력하세요"
            />
          }
        />
        <FormField
          label="색상"
          input={
            <div className="flex flex-row gap-1.5 overflow-hidden">
              <button
                onClick={handleRefreshClick}
                style={{ backgroundColor: color }}
                className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-sm transition-colors"
              >
                <RefreshCcw size={18} color="#464646" strokeWidth={2.2} />
              </button>
              <input
                value={color}
                onChange={handleColorInput}
                className="h-8 min-w-0 flex-1 rounded-md border-[1px] border-[#d0d9e0] bg-[#f5f6fa] px-2"
              />
            </div>
          }
        />
      </div>
      <button
        onClick={handleSave}
        className="self-end rounded-md bg-[#231f20] px-3.5 py-1.5 font-normal text-white"
      >
        저장
      </button>
    </div>
  );
}
