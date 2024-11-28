import { useSyncedUsers } from "@/entities/user";
import { SideWrapper } from "@/shared/ui";
import { CanvasView } from "@/widgets/CanvasView";
import { EditorView } from "@/widgets/EditorView";
import { PageSideBarView } from "@/widgets/PageSideBarView";
import { CanvasToolsView } from "@/widgets/CanvasToolsView";
import { useGetUser } from "@/features/auth/model/useAuth";

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
      </SideWrapper>
    </div>
  );
}

export default App;
