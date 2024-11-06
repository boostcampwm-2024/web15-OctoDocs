import { cn } from "@/lib/utils";

const noteTitles = ["🌳 그라운드 룰", "🚩 커밋 컨벤션", "🗂️ 데일리 스크럼 "];

interface NoteListProps {
  className?: string;
}

export default function NoteList({ className }: NoteListProps) {
  return (
    <div className={cn("flex flex-col gap-1.5 text-sm font-normal", className)}>
      {noteTitles.map((title) => (
        <div>{title}</div>
      ))}
    </div>
  );
}
