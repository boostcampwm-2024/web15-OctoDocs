import { useSyncedUsers } from "@/entities/user";
import { useProtectedWorkspace } from "@/features/workspace";
import { CanvasView } from "@/widgets/CanvasView";
import { CanvasToolsView } from "@/widgets/CanvasToolsView";
import { EditorView } from "@/widgets/EditorView";
import { NodeToolsView } from "@/widgets/NodeToolsView";
import { PageSideBarView } from "@/widgets/PageSideBarView";
import { CanvasToolsView } from "@/widgets/CanvasToolsView";
import { SideWrapper } from "@/shared/ui";

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
        <NodeToolsView />
      </SideWrapper>
    </div>
  );
}

export default App;
