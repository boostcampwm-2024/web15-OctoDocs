import { useRef } from "react";
import { X } from "lucide-react";

interface DialogTitleProps {
  children: React.ReactNode;
}

function DialogTitle({ children }: DialogTitleProps) {
  return <h2 className="text-lg font-semibold">{children}</h2>;
}

interface DialogCloseButtonProps {
  onCloseModal: () => void;
}

function DialogCloseButton({ onCloseModal }: DialogCloseButtonProps) {
  return (
    <button
      className="absolute right-4 top-4 text-neutral-400 transition-colors hover:text-neutral-700"
      onClick={onCloseModal}
    >
      <X width={16} height={16} />
    </button>
  );
}

interface DialogMainProps {
  isOpen: boolean;
  onCloseModal: () => void;
  children: React.ReactNode;
}

function DialogMain({ isOpen, onCloseModal, children }: DialogMainProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const showModal = () => {
    dialogRef.current?.showModal();
  };

  const closeModal = () => {
    dialogRef.current?.close();
  };

  if (isOpen) {
    showModal();
  } else {
    closeModal();
  }

  return (
    <dialog
      className="rounded-xl"
      open={isOpen}
      ref={dialogRef}
      onClick={() => {
        onCloseModal();
        closeModal();
      }}
    >
      <div
        className="flex flex-col gap-4 px-12 py-10"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </dialog>
  );
}

export const Dialog = Object.assign(DialogMain, {
  Title: DialogTitle,
  CloseButton: DialogCloseButton,
});
