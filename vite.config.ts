import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  resolve: {
    alias: {
      "@tanstack/react-router": fileURLToPath(new URL("./src/lib/router-compat.tsx", import.meta.url)),
      "@tanstack/react-start": fileURLToPath(new URL("./src/lib/start-compat.ts", import.meta.url)),
    },
  },
});
