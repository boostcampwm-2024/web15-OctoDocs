import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useSyncedUsers } from "@/entities/user/model";
import { SideWrapper } from "@/shared/ui";
import { CanvasView } from "@/widgets/CanvasView";
import { EditorView } from "@/widgets/EditorView";
import { PageSideBarView } from "@/widgets/PageSideBarView";
import { CanvasToolsView } from "@/widgets/CanvasToolsView";

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
        <SideWrapper
          side="left"
          className="left-4 top-4 flex flex-row items-start gap-2"
        >
          <PageSideBarView />
          <CanvasToolsView />
        </SideWrapper>
      </div>
    </QueryClientProvider>
  );
}

export default App;
