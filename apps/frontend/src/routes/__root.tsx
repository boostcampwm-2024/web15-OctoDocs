import App from "@/app/App";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <App />
      <Outlet />
    </>
  ),
});
