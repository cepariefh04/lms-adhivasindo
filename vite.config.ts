import vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig } from "vite";

// ⚠️ GANTI 'lms-adhivasindo' dengan nama repository GitHub kamu
const REPO_NAME = "lms-adhivasindo";

export default defineConfig({
  plugins: [vue()],

  // Wajib untuk GitHub Pages agar asset URL benar
  // Format: '/<nama-repository>/'
  base: process.env.NODE_ENV === "production" ? `/${REPO_NAME}/` : "/",

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
