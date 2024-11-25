import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useSyncedUsers } from "../entities/user/model/useSyncedUsers";
import { EditorView } from "../widgets/EditorView";
import { CanvasView } from "../widgets/CanvasView";
import { SideWrapper } from "../shared/ui";
import { PageSideBarView } from "../widgets/PageSideBarView";

const queryClient = new QueryClient();

function App() {
  useSyncedUsers();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="fixed inset-0 bg-white">
        <SideWrapper side="right" className="z-50">
          <EditorView />
        </SideWrapper>
        <CanvasView />
        <SideWrapper side="left" className="left-4 top-4">
          <PageSideBarView />
        </SideWrapper>
      </div>
    </QueryClientProvider>
  );
}

export default App;
