import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Sidebar from "./components/sidebar";
import HoverTrigger from "./components/HoverTrigger";
import Editor from "./components/editor";
import { defaultEditorContent } from "./components/editor/content";
import SideWrapper from "./components/layout/SideWrapper";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen bg-[#231F20]">
        <SideWrapper side="right">
          <Editor initialValue={defaultEditorContent} />
        </SideWrapper>
        <HoverTrigger className="w-64">
          <Sidebar />
        </HoverTrigger>
      </div>
    </QueryClientProvider>
  );
}

export default App;
