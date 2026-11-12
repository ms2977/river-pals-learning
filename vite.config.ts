import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repository = process.env.GITHUB_REPOSITORY?.split("/")[1] || "river-pals-learning";
export default defineConfig({
  base: repository.endsWith(".github.io") ? "/" : `/${repository}/`,
  plugins: [react()],
});
