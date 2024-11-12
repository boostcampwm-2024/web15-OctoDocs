import { Trash2 } from "lucide-react";

import RemoveNoteModal from "./RemoveNoteModal";

import { useNoteList } from "@/hooks/useNoteList";
import { cn } from "@/lib/utils";
import Button from "../commons/button";

interface NoteListProps {
  className?: string;
}

export default function NoteList({ className }: NoteListProps) {
  const {
    pages,
    isModalOpen,
    handleNoteClick,
    openModal,
    onConfirm,
    onCloseModal,
  } = useNoteList();

  if (!pages) {
    return <div>로딩중</div>;
  }

  return (
    <div className={cn("flex flex-col gap-0.5 text-sm font-medium", className)}>
      <RemoveNoteModal
        isOpen={isModalOpen}
        onConfirm={onConfirm}
        onCloseModal={onCloseModal}
      />
      {pages.map(({ id, title }) => (
        <Button
          onClick={() => handleNoteClick(id)}
          key={id}
          className="group flex flex-row justify-between rounded-sm px-3 py-1 hover:bg-neutral-100"
        >
          <div className="w-full truncate text-start">{title}</div>
          <span
            className="hidden text-neutral-400 transition-colors hover:text-red-500 group-hover:block"
            onClick={(e) => {
              e.stopPropagation();
              openModal(id);
            }}
          >
            <Trash2 width={20} height={20} />
          </span>
        </Button>
      ))}
    </div>
  );
}
