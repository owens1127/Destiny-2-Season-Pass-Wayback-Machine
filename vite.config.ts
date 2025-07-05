import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: "manifest.json",
          dest: "."
        },
        {
          src: "src/popup.html",
          dest: "."
        },
        {
          src: "icon.png",
          dest: "assets"
        }
      ]
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve("src")
    }
  },
  build: {
    outDir: "build",
    minify: false,
    target: ["chrome111", "firefox110"],
    rollupOptions: {
      input: {
        content: "src/content.tsx",
        styles: "src/styles.css"
      },
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "assets/[name].[ext]",
        chunkFileNames: "assets/[name].js"
      }
    }
  }
});
