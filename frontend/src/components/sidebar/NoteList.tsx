import { Trash2 } from "lucide-react";

import RemoveNoteModal from "./RemoveNoteModal";

import { useNoteList } from "@/hooks/useNoteList";
import { cn } from "@/lib/utils";

interface NoteListProps {
  className?: string;
}

export default function NoteList({ className }: NoteListProps) {
  const {
    data,
    isModalOpen,
    handleNoteClick,
    openModal,
    onConfirm,
    onCloseModal,
  } = useNoteList();

  if (!data) {
    return <div>로딩중</div>;
  }

  return (
    <div className={cn("flex flex-col gap-0.5 text-sm font-medium", className)}>
      <RemoveNoteModal
        isOpen={isModalOpen}
        onConfirm={onConfirm}
        onCloseModal={onCloseModal}
      />
      {data.map(({ id, title }) => (
        <button
          onClick={() => handleNoteClick(id)}
          key={id}
          className="group flex flex-row justify-between rounded-sm px-2 py-1 hover:bg-neutral-100"
        >
          <div className="flex flex-row gap-1">
            <div>{title}</div>
          </div>
          <span
            className="hidden text-neutral-400 transition-colors hover:text-red-500 group-hover:block"
            onClick={(e) => {
              e.stopPropagation();
              openModal(id);
            }}
          >
            <Trash2 width={20} height={20} />
          </span>
        </button>
      ))}
    </div>
  );
}
