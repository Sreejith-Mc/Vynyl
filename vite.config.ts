import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      // Generate all icon sizes (incl. maskable + Apple touch) from public/logo.svg
      pwaAssets: { image: "public/logo.svg", preset: "minimal-2023", overrideManifestIcons: true },
      manifest: {
        id: "/",
        name: "Vynyl — Music",
        short_name: "Vynyl",
        description: "Every song ever made. Wrapped in warmth.",
        theme_color: "#ECE5D8",
        background_color: "#ECE5D8",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        categories: ["music", "entertainment"],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
        // Never let the SW intercept the music API — always hit the network.
        navigateFallbackDenylist: [/^\/saavn/, /^\/api/],
      },
      devOptions: { enabled: false },
    }),
  ],
  server: {
    port: 5173,
    open: true,
    // Dev-only proxy so JioSaavn calls dodge CORS. In production a serverless
    // function at /saavn does the same job (see api/saavn.js + vercel.json).
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
