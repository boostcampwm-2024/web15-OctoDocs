import NoteList from "./NoteList";
import TopNav from "./TopNav";
import Tools from "./Tools";

export default function Sidebar() {
  return (
    <div className="z-10 flex w-64 flex-col gap-4 rounded-lg border-[1px] border-neutral-200 bg-white p-4 text-black shadow-sm">
      <TopNav />
      <Tools />
      <NoteList className="mx-1" />
    </div>
  );
}
