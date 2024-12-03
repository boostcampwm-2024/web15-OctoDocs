import WarningIcon from "/icons/warning-icon.png";
import { Button, Dialog } from "@/shared/ui";

type RemoveNoteModalProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onCloseModal: () => void;
};

export function RemoveNoteModal({
  isOpen,
  onConfirm,
  onCloseModal,
}: RemoveNoteModalProps) {
  return (
    <Dialog isOpen={isOpen} onCloseModal={onCloseModal}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-1.5">
          <img src={WarningIcon} alt="warning" className="h-16 w-16" />
          <Dialog.Title>페이지 삭제</Dialog.Title>
          <Dialog.Description>정말 삭제하시겠습니까?</Dialog.Description>
        </div>
        <div className="flex w-full flex-row justify-between gap-2">
          <Button
            className="w-full rounded-lg bg-[#fd5b56] text-neutral-100 hover:bg-red-500"
            onClick={onConfirm}
          >
            삭제
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
