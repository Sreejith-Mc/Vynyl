import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    // Proxy music APIs in dev to avoid any CORS friction.
    proxy: {
      "/saavn": {
        target: "https://www.jiosaavn.com",
        changeOrigin: true,
        headers: { Referer: "https://www.jiosaavn.com/" },
        rewrite: (p) => p.replace(/^\/saavn/, ""),
      },
    },
  },
});
