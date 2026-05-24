import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    proxy: {
      "/api": "http://localhost:4000",
    },
    allowedHosts: [
      // Change this using ngrok for https
      "f6e1512223a2.ngrok-free.app"
    ],
  },
  plugins: [react(), tailwindcss()],
});
