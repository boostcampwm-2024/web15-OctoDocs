import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../shared/index.css";
import { TanstackQueryProvider } from "./providers/TanstackQueryProvider";
import { TanstackRouterProvider } from "./providers/TanstackRouterProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TanstackQueryProvider>
      <TanstackRouterProvider />
    </TanstackQueryProvider>
  </StrictMode>,
);
