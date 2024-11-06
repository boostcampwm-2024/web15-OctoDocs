import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Sidebar from "./components/sidebar";
import HoverTrigger from "./components/HoverTrigger";
import Editor from "./components/editor";
import { defaultEditorContent } from "./components/editor/content";
import SideWrapper from "./components/layout/SideWrapper";
import Canvas from "./components/canvas";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen bg-white">
        <SideWrapper side="right">
          <Editor initialValue={defaultEditorContent} />
        </SideWrapper>
        <Canvas className="z-0 h-full w-full" />
        <HoverTrigger className="absolute inset-0 z-20 w-64">
          <Sidebar />
        </HoverTrigger>
      </div>
    </QueryClientProvider>
  );
}

export default App;
