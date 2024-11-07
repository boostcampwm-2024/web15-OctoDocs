import { cn } from "@/lib/utils";
import usePageStore from "@/store/usePageStore";

const noteList = [
  { id: 0, icon: "🌳", title: "그라운드 룰" },
  { id: 1, icon: "🚩", title: "커밋 컨벤션" },
  { id: 2, icon: "🗂️", title: "데일리 스크럼" },
];

interface NoteListProps {
  className?: string;
}

export default function NoteList({ className }: NoteListProps) {
  const { setCurrentPage } = usePageStore();

  const handleNoteClick = (id: number) => {
    setCurrentPage(id);
  };

  return (
    <div className={cn("flex flex-col gap-0.5 text-sm font-medium", className)}>
      {noteList.map(({ id, icon, title }) => (
        <button
          onClick={() => handleNoteClick(id)}
          key={id}
          className="flex flex-row gap-1 rounded-sm px-2 py-1 hover:bg-neutral-100"
        >
          <div>{icon}</div>
          <div>{title}</div>
        </button>
      ))}
    </div>
  );
}
