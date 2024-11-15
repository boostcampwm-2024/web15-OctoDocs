// vite.config.ts
import { defineConfig } from "file:///C:/Users/growth/Desktop/%EC%9C%A0%EC%84%B1%EB%AF%BC/%EB%B6%80%EC%8A%A4%ED%8A%B8%EC%BA%A0%ED%94%84/%EB%A9%A4%EB%B2%84%EC%8B%AD/test/octodocs/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/growth/Desktop/%EC%9C%A0%EC%84%B1%EB%AF%BC/%EB%B6%80%EC%8A%A4%ED%8A%B8%EC%BA%A0%ED%94%84/%EB%A9%A4%EB%B2%84%EC%8B%AD/test/octodocs/node_modules/@vitejs/plugin-react/dist/index.mjs";
import tailwindcss from "file:///C:/Users/growth/Desktop/%EC%9C%A0%EC%84%B1%EB%AF%BC/%EB%B6%80%EC%8A%A4%ED%8A%B8%EC%BA%A0%ED%94%84/%EB%A9%A4%EB%B2%84%EC%8B%AD/test/octodocs/node_modules/tailwindcss/lib/index.js";
import tsconfigPaths from "file:///C:/Users/growth/Desktop/%EC%9C%A0%EC%84%B1%EB%AF%BC/%EB%B6%80%EC%8A%A4%ED%8A%B8%EC%BA%A0%ED%94%84/%EB%A9%A4%EB%B2%84%EC%8B%AD/test/octodocs/node_modules/vite-tsconfig-paths/dist/index.js";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\growth\\Desktop\\\uC720\uC131\uBBFC\\\uBD80\uC2A4\uD2B8\uCEA0\uD504\\\uBA64\uBC84\uC2ED\\test\\octodocs\\apps\\frontend";
var vite_config_default = defineConfig({
  plugins: [react(), tsconfigPaths()],
  css: {
    postcss: {
      plugins: [tailwindcss()]
    }
  },
  envDir: path.join(__vite_injected_original_dirname, "..", "..", ".env"),
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxncm93dGhcXFxcRGVza3RvcFxcXFxcdUM3MjBcdUMxMzFcdUJCRkNcXFxcXHVCRDgwXHVDMkE0XHVEMkI4XHVDRUEwXHVENTA0XFxcXFx1QkE2NFx1QkM4NFx1QzJFRFxcXFx0ZXN0XFxcXG9jdG9kb2NzXFxcXGFwcHNcXFxcZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGdyb3d0aFxcXFxEZXNrdG9wXFxcXFx1QzcyMFx1QzEzMVx1QkJGQ1xcXFxcdUJEODBcdUMyQTRcdUQyQjhcdUNFQTBcdUQ1MDRcXFxcXHVCQTY0XHVCQzg0XHVDMkVEXFxcXHRlc3RcXFxcb2N0b2RvY3NcXFxcYXBwc1xcXFxmcm9udGVuZFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvZ3Jvd3RoL0Rlc2t0b3AvJUVDJTlDJUEwJUVDJTg0JUIxJUVCJUFGJUJDLyVFQiVCNiU4MCVFQyU4QSVBNCVFRCU4QSVCOCVFQyVCQSVBMCVFRCU5NCU4NC8lRUIlQTklQTQlRUIlQjIlODQlRUMlOEIlQUQvdGVzdC9vY3RvZG9jcy9hcHBzL2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSBcInRhaWx3aW5kY3NzXCI7XHJcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gXCJ2aXRlLXRzY29uZmlnLXBhdGhzXCI7XHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbi8vIGh0dHBzOi8vdml0ZS5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtyZWFjdCgpLCB0c2NvbmZpZ1BhdGhzKCldLFxyXG4gIGNzczoge1xyXG4gICAgcG9zdGNzczoge1xyXG4gICAgICBwbHVnaW5zOiBbdGFpbHdpbmRjc3MoKV0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgZW52RGlyOiBwYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4uXCIsIFwiLi5cIiwgXCIuZW52XCIpLFxyXG4gIHNlcnZlcjoge1xyXG4gICAgcHJveHk6IHtcclxuICAgICAgXCIvYXBpXCI6IHtcclxuICAgICAgICB0YXJnZXQ6IFwiaHR0cDovL2xvY2FsaG9zdDozMDAwXCIsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtZSxTQUFTLG9CQUFvQjtBQUNoZ0IsT0FBTyxXQUFXO0FBQ2xCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sbUJBQW1CO0FBQzFCLE9BQU8sVUFBVTtBQUpqQixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxHQUFHLGNBQWMsQ0FBQztBQUFBLEVBQ2xDLEtBQUs7QUFBQSxJQUNILFNBQVM7QUFBQSxNQUNQLFNBQVMsQ0FBQyxZQUFZLENBQUM7QUFBQSxJQUN6QjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVEsS0FBSyxLQUFLLGtDQUFXLE1BQU0sTUFBTSxNQUFNO0FBQUEsRUFDL0MsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLE1BQ2hCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
