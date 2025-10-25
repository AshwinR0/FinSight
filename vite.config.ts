import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // Automatically update the service worker
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"], // Cache these file types
      },
      devOptions: {
        enabled: mode === "development", // Enable PWA in development mode
      },
      // Configuration for the Web App Manifest (the installable data)
      manifest: {
        name: "FinSight",
        short_name: "FinSight",
        description: "lightweight personal finance management app",
        theme_color: "#000000",
        orientation: "portrait",
        display: "standalone",
        background_color: "#ffffff",
        start_url: "/",
        scope: "/",
        icons: [
          // You should replace these with your actual icon files
          {
            src: "android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
}));
