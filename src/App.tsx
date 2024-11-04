import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="text-4xl">hiiii</div>{" "}
    </QueryClientProvider>
  );
}

export default App;
