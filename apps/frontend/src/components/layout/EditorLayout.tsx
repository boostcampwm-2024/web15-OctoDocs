import { cn } from "@/lib/utils";
import usePageStore from "@/store/usePageStore";
import EditorActionPanel from "../editor/EditorActionPanel";

interface EditorLayoutProps {
  saveStatus: "saved" | "unsaved";
  children: React.ReactNode;
}

const EditorLayout = ({ children, saveStatus }: EditorLayoutProps) => {
  const { isPanelOpen, isMaximized } = usePageStore();

  return (
    <div
      className={cn(
        "absolute right-0 h-[720px] w-[520px] rounded-bl-lg rounded-br-lg rounded-tr-lg border bg-white shadow-lg transition-transform duration-100 ease-in-out",
        isPanelOpen ? "transform-none" : "translate-x-full",
        isMaximized ? "h-screen w-screen" : "w-[520px]",
      )}
    >
      <EditorActionPanel saveStatus={saveStatus} />
      <div
        className={cn(
          "flex h-full flex-col gap-4 overflow-auto px-12 py-4",
          isMaximized && "mx-auto mt-8 box-content w-[800px] px-0",
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default EditorLayout;
