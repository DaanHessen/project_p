import { defineConfig } from "vitest/config";
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

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    // The sibling checkout lives outside this project, and ascii-blobs declares
    // react as an optional peer. Without deduping, rolldown resolves react from
    // inside that checkout to an empty optional-peer stub and the build fails on
    // every missing hook.
    dedupe: ["react", "react-dom"],

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
    rollupOptions: {
      output: {
        // Vite 8 bundles with rolldown, which only accepts the function form
        // of manualChunks. React is split out because it changes far less
        // often than the site does.
        manualChunks(id) {
          if (id.includes("node_modules/react")) return "vendor";
          return undefined;
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
  },

  optimizeDeps: {
    include: ["react", "react-dom"],
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
