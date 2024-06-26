import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import VueDevTools from "vite-plugin-vue-devtools";
import {resolve} from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue() /* VueDevTools() */],
  server: {
    port: 4000,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["vue", "vue-router"],
  },
});
