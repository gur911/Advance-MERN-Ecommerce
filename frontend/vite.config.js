import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/": "https://advanced-mern-ecommerce.onrender.com",
      "/uploads/": "https://advanced-mern-ecommerce.onrender.com",
    },
  },
});
