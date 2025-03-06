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
          src: path.resolve(__dirname, "manifest.json"),
          dest: "."
        },
        {
          src: path.resolve(__dirname, "src/popup.html"),
          dest: "."
        },
        {
          src: path.resolve(__dirname, "icon.png"),
          dest: "./assets"
        }
      ]
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  build: {
    outDir: path.resolve(__dirname, "build"),
    minify: false,
    target: ["chrome111", "firefox110"],
    rollupOptions: {
      input: {
        content: path.resolve(__dirname, "src/content.tsx"),
        styles: path.resolve(__dirname, "src/styles.css")
      },
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "assets/[name].[ext]",
        chunkFileNames: "assets/[name].js"
      }
    }
  }
});
