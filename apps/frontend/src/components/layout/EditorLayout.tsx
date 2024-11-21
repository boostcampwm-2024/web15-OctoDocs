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
        "absolute right-4 top-4 flex h-[720px] w-[520px] flex-col rounded-lg border bg-white shadow-lg transition-transform duration-100 ease-in-out",
        isPanelOpen ? "transform-none" : "translate-x-full",
        isMaximized ? "right-0 top-0 h-screen w-screen" : "",
      )}
    >
      <EditorActionPanel saveStatus={saveStatus} />
      {isMaximized ? (
        <div className="flex-1 overflow-auto">
          <div className="mx-auto w-[800px] py-4">{children}</div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-4 overflow-auto px-12 py-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default EditorLayout;
