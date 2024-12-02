import { useSyncedUsers } from "@/entities/user";
import { SideWrapper } from "@/shared/ui";
import { CanvasView } from "@/widgets/CanvasView";
import { EditorView } from "@/widgets/EditorView";
import { PageSideBarView } from "@/widgets/PageSideBarView";
import { CanvasToolsView } from "@/widgets/CanvasToolsView";
import { useProtectedWorkspace } from "@/features/workspace/model/useProtectedWorkspace";

function App() {
  useSyncedUsers();
  const { isLoading } = useProtectedWorkspace();

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  // If we're not loading and have workspace data, show the main content
  return (
    <div className="fixed inset-0 bg-white">
      <SideWrapper side="right" className="z-50">
        <EditorView />
      </SideWrapper>
      <CanvasView />
      <SideWrapper
        side="left"
        className="left-4 top-4 flex flex-row items-start gap-2"
      >
        <PageSideBarView />
        <CanvasToolsView />
      </SideWrapper>
    </div>
  );
}

export default App;
