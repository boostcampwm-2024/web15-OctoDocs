import Button from "../commons/button";
import { Dialog } from "../commons/dialog";

type RemoveNoteModalProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onCloseModal: () => void;
};

export default function RemoveNoteModal({
  isOpen,
  onConfirm,
  onCloseModal,
}: RemoveNoteModalProps) {
  return (
    <Dialog isOpen={isOpen} onCloseModal={onCloseModal}>
      <Dialog.Title>페이지를 삭제하시겠습니까?</Dialog.Title>
      <Dialog.CloseButton onCloseModal={onCloseModal} />
      <div className="flex flex-row justify-center gap-2">
        <Button
          className="bg-red-500 text-neutral-200 hover:bg-red-600"
          onClick={onConfirm}
        >
          삭제
        </Button>
        <Button
          className="text-neutral-700 hover:bg-neutral-100"
          onClick={onCloseModal}
        >
          취소
        </Button>
      </div>
    </Dialog>
  );
}
