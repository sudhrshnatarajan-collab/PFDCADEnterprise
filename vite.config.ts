import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],

  base: "/PFDCADEnterprise/", // <-- Change this to your GitHub repository name

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
