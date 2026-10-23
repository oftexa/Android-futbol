import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Modo prompt (arquitectura 6.2): la nueva versión no se aplica sola.
      registerType: "prompt",
      // El registro lo hace el hook de virtual:pwa-register/react (src/actualizaciones).
      injectRegister: false,
      includeAssets: ["icon.svg", "icon-192.png", "icon-512.png"],
      manifest: {
        name: "Android Futbol 4",
        short_name: "AF4",
        description: "Juego de gestión de fútbol para un jugador.",
        lang: "es",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#0d1b0f",
        theme_color: "#2e7d32",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
        ],
      },
    }),
  ],
  test: {
    environment: "jsdom",
    include: ["test/**/*.spec.tsx"],
    setupFiles: ["./test/setup.ts"],
  },
});
