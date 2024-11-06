import NoteList from "@/components/sidebar/NoteList";
import TopNav from "@/components/sidebar/TopNav";

export default function Sidebar() {
  return (
    <div className="z-10 flex w-64 flex-col gap-4 rounded-lg border-[1px] border-neutral-200 bg-white p-4 text-black shadow-sm">
      <TopNav />
      <NoteList className="mx-1" />
    </div>
  );
}

// truncate
