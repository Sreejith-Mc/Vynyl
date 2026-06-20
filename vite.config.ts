import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    // Proxy music APIs in dev to avoid any CORS friction.
    proxy: {
      "/jamendo": {
        target: "https://api.jamendo.com",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/jamendo/, ""),
      },
      "/itunes": {
        target: "https://itunes.apple.com",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/itunes/, ""),
      },
    },
  },
});
