import { useEffect, useState } from "react";
import { Compact } from "@uiw/react-color";

import { useUserStore } from "@/entities/user";
import { Button, Dialog } from "@/shared/ui";

type RemoveNoteModalProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onCloseModal: () => void;
};

export function ProfileModal({
  isOpen,
  onConfirm,
  onCloseModal,
}: RemoveNoteModalProps) {
  const { currentUser, setCurrentUser, provider } = useUserStore();
  const [hex, setHex] = useState(currentUser.color);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [nickname, setNickname] = useState(currentUser.clientId);

  useEffect(() => {
    setNickname(currentUser.clientId);
    setHex(currentUser.color);
  }, [currentUser]);

  return (
    <Dialog isOpen={isOpen} onCloseModal={onCloseModal}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-1.5">
          <Dialog.Title>프로필 수정</Dialog.Title>
        </div>
        <div className="flex flex-row items-center gap-3">
          <button
            className="h-12 w-12 rounded-full border-[1px] border-black"
            style={{ backgroundColor: hex }}
            onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
          />

          <input
            className={
              "h-10 rounded-md border-[1px] border-[#eaeaea] p-2 text-sm text-[#141414] outline-none"
            }
            placeholder="닉네임을 입력하세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div className="">
          {isColorPickerOpen && (
            <Compact color={hex} onChange={(color) => setHex(color.hex)} />
          )}
        </div>

        <div className="flex w-full flex-row justify-between gap-2">
          <Button
            className="w-full rounded-lg bg-[#171717] text-neutral-100 hover:bg-slate-800"
            onClick={() => {
              provider.awareness.setLocalStateField("color", hex);
              provider.awareness.setLocalStateField("clientId", nickname);

              setCurrentUser({
                ...currentUser,
                color: hex,
                clientId: nickname,
              });

              onConfirm();
            }}
          >
            확인
          </Button>
          <Button
            className="w-full rounded-lg bg-[#f4f4f5] text-neutral-700 hover:bg-neutral-200"
            onClick={onCloseModal}
          >
            취소
          </Button>
        </div>
      </div>
      <Dialog.CloseButton onCloseModal={onCloseModal} />
    </Dialog>
  );
}
