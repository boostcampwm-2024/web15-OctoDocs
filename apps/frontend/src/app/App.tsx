import { useSyncedUsers } from "@/entities/user";
import { useGetUser } from "@/features/auth";
import { CanvasView } from "@/widgets/CanvasView";
import { CanvasToolsView } from "@/widgets/CanvasToolsView";
import { EditorView } from "@/widgets/EditorView";
import { NodeToolsView } from "@/widgets/NodeToolsView";
import { PageSideBarView } from "@/widgets/PageSideBarView";
import { SideWrapper } from "@/shared/ui";

function App() {
  useSyncedUsers();
  useGetUser();

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
