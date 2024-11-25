import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Sidebar from "./components/sidebar";
import SideWrapper from "./components/layout/SideWrapper";
import Canvas from "./components/canvas";

import { useSyncedUsers } from "./hooks/useSyncedUsers";
import { EditorView } from "./widgets/EditorView";

const queryClient = new QueryClient();

function App() {
  useSyncedUsers();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="fixed inset-0 bg-white">
        <SideWrapper side="right" className="z-50">
          <EditorView />
        </SideWrapper>
        <Canvas className="z-0 h-full w-full" />
        <SideWrapper side="left" className="left-4 top-4">
          <Sidebar />
        </SideWrapper>
      </div>
    </QueryClientProvider>
  );
}

export default App;
