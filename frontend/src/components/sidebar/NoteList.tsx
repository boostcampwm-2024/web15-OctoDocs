const noteTitles = ["🌳 그라운드 룰", "🚩 커밋 컨벤션", "🗂️ 데일리 스크럼 "];

export default function NoteList() {
  return (
    <div className="flex flex-col gap-2">
      {noteTitles.map((title) => (
        <div>{title}</div>
      ))}
    </div>
  );
}
