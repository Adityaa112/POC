import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === "development" ? "/" : "/poc/",
  resolve: {
    alias: { "@": "/src" },
  },
  server: {
    proxy: {
      "/v1": {
        target: "https://preprodapisix.omnenest.com",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
      "/v2": {
        target: "https://preprodapisix.omnenest.com",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
    },
  },
}));
