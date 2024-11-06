import NoteList from "@/components/sidebar/NoteList";
import TopNav from "@/components/sidebar/TopNav";

export default function Sidebar() {
  return (
    <div className="flex w-64 flex-col gap-4 rounded-lg bg-white p-4 text-black">
      <TopNav />
      <NoteList className="mx-1" />
    </div>
  );
}

// truncate
