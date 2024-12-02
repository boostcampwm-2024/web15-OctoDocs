import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite(), react(), tsconfigPaths()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    watch: {
      usePolling: true,
      interval: 1000,
    },
    hmr: {
      protocol: "wss",
      clientPort: 443,
      path: "hmr/",
    },
  },
});
