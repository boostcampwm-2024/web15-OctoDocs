import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Sidebar from "./components/sidebar";
import SideWrapper from "./components/layout/SideWrapper";

import { useSyncedUsers } from "./hooks/useSyncedUsers";
import { EditorView } from "./widgets/EditorView";
import { CanvasView } from "./widgets/CanvasView";

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
          <Sidebar />
        </SideWrapper>
      </div>
    </QueryClientProvider>
  );
}

export default App;
