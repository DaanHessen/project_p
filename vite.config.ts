import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const resumeVersion =
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) ??
  process.env.npm_package_version ??
  Date.now().toString();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: ({ url, sameOrigin }) =>
              sameOrigin &&
              (/\/resume(?:\.html)?$/.test(url.pathname) ||
                /\/resume(?:\.html)?$/.test(url.pathname.replace(/\/$/,""))),
            handler: 'NetworkOnly',
          },
        ],
        manifestTransforms: [
          async (entries) => ({
            manifest: entries.filter((entry) => entry.url !== "resume.html"),
            warnings: [],
          }),
        ],
      },
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "robots.txt",
        "sitemap.xml",
      ],
      manifest: {
        name: "Daan Hessen - Full Stack Developer Portfolio",
        short_name: "Daan Hessen",
        description:
          "Portfolio website of Daan Hessen, Software Developer and HBO-ICT student",
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],

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
