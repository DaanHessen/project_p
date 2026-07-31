/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const asciiBlobsSrc = resolve(here, "../ASCII-blobs/src");

// ascii-blobs is developed alongside this site. When the sibling checkout is
// present, resolve it to source so edits show up without a publish/link cycle;
// otherwise fall through to the installed package.
const linkAsciiBlobs = existsSync(asciiBlobsSrc);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: linkAsciiBlobs
      ? {
          "ascii-blobs/dist/style.css": resolve(
            asciiBlobsSrc,
            "components/AsciiBlobs.css",
          ),
          "ascii-blobs": resolve(asciiBlobsSrc, "index.ts"),
        }
      : {},
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
    // Linked during development; prebundling would serve a stale copy.
    exclude: ["ascii-blobs"],
  },
  server: {
    fs: {
      strict: true,
    },
  },

  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
