import { cn } from "@/lib/utils";

const noteList = [
  { icon: "🌳", title: "그라운드 룰" },
  { icon: "🚩", title: "커밋 컨벤션" },
  { icon: "🗂️", title: "데일리 스크럼" },
];

interface NoteListProps {
  className?: string;
}

export default function NoteList({ className }: NoteListProps) {
  return (
    <div className={cn("flex flex-col gap-0.5 text-sm font-medium", className)}>
      {noteList.map(({ icon, title }) => (
        <div className="flex flex-row gap-1 rounded-sm px-2 py-1 hover:bg-neutral-100">
          <div>{icon}</div>
          <div>{title}</div>
        </div>
      ))}
    </div>
  );
}
