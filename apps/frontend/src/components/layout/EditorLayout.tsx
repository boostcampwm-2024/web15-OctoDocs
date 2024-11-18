import { PanelRightClose, PanelLeftClose } from "lucide-react";
import usePageStore from "@/store/usePageStore";

interface EditorLayoutProps {
  children: React.ReactNode;
}

const EditorLayout = ({ children }: EditorLayoutProps) => {
  const { isPanelOpen, togglePanel } = usePageStore();

  return (
    <div
      className={`absolute right-0 h-[720px] w-[520px] rounded-bl-lg rounded-br-lg rounded-tr-lg border bg-white shadow-lg transition-transform duration-100 ease-in-out ${
        isPanelOpen ? "transform-none" : "translate-x-full"
      }`}
    >
      <div className="h-full overflow-auto">{children}</div>

      <button
        onClick={togglePanel}
        className="absolute -left-8 top-0 z-50 flex h-8 w-8 !cursor-pointer items-center justify-center rounded-l border-b border-l border-t border-[#e0e6ee] bg-[#f5f5f5]"
      >
        {isPanelOpen ? (
          <PanelRightClose className="h-4 w-4" />
        ) : (
          <PanelLeftClose className="h-4 w-4" />
        )}
      </button>
    </div>
  );
};

export default EditorLayout;
