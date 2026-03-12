import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// PUBLIC_INTERFACE
export default defineConfig({
  /** Vite config for the Notes frontend. */
  plugins: [react()],
  server: {
    host: true
  },
  preview: {
    host: true
  }
});
