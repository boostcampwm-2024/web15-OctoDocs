import NoteList from "@/components/sidebar/NoteList";
import TopNav from "@/components/sidebar/TopNav";
import HorizontalDivider from "@/components/commons/divider/HorizontalDivider";

export default function Sidebar() {
  return (
    <div className="w-64 rounded-lg bg-white p-2">
      <div className="font-pretendard text-md flex flex-col gap-3 bg-white p-2 text-black">
        <TopNav />
        <HorizontalDivider />
        <NoteList />
      </div>
    </div>
  );
}

// truncate
