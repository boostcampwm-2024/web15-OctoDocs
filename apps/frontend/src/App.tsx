import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Sidebar from "./components/sidebar";
import EditorView from "./components/EditorView";
import SideWrapper from "./components/layout/SideWrapper";
import Canvas from "./components/canvas";
import CanvasTools from "./components/canvasTools";

import { useSyncedUsers } from "./hooks/useSyncedUsers";

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
        <SideWrapper
          side="left"
          className="left-4 top-4 flex flex-row items-start gap-2"
        >
          <Sidebar />
          <CanvasTools />
        </SideWrapper>
      </div>
    </QueryClientProvider>
  );
}

export default App;
