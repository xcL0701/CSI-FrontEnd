import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": "https://projectbe-khqp4.kinsta.app",
      "/storage": "https://projectbe-khqp4.kinsta.app",
    },
  },
});
