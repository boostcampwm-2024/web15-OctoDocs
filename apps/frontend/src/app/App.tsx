import { useEffect } from "react";
import * as Y from "yjs";

import { useSyncedUsers } from "@/entities/user/model";
import { SideWrapper } from "@/shared/ui";
import { CanvasView } from "@/widgets/CanvasView";
import { EditorView } from "@/widgets/EditorView";
import { PageSideBarView } from "@/widgets/PageSideBarView";
import { CanvasToolsView } from "@/widgets/CanvasToolsView";
import { useWorkspace } from "@/shared/lib/useWorkspace";
import useYDocStore from "@/shared/model/ydocStore";
import { useGetUser } from "@/features/auth/model/useAuth";

function App() {
  useSyncedUsers();
  useGetUser();

  const workspace = useWorkspace();
  const { setYDoc } = useYDocStore();

  useEffect(() => {
    const doc = new Y.Doc({ guid: workspace });
    setYDoc(doc);
  }, [workspace, setYDoc]);

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
