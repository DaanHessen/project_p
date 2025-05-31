import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
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
          "Portfolio website of Daan Hessen, Full Stack Developer and HBO-ICT student",
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
  // Environment variables configuration
  define: {
    'import.meta.env.VITE_DATABASE_URL': JSON.stringify(process.env.VITE_DATABASE_URL || process.env.DATABASE_URL || 'postgres://neondb_owner:npg_qXvF9DJkE8jS@ep-royal-meadow-abrmk6ta-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'),
  },
  build: {
    // Optimize for SEO and performance
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          animations: ["framer-motion"],
        },
      },
    },
    // Generate source maps for better debugging
    sourcemap: false,
    // Optimize chunk size
    chunkSizeWarningLimit: 600,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom", "framer-motion"],
  },
  // Performance optimizations
  server: {
    fs: {
      strict: true,
    },
  },
});
