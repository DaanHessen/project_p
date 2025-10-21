import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const resumeVersion =
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) ??
  process.env.npm_package_version ??
  Date.now().toString();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  define: {
    __RESUME_VERSION__: JSON.stringify(resumeVersion),
  },

  build: {
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          animations: ["framer-motion"],
        },
      },
    },
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    cssCodeSplit: true,
    cssMinify: true,
  },
  
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      css: {
        charset: false,
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "framer-motion"],
  },
  server: {
    fs: {
      strict: true,
    },
  },
});
