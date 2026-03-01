/// <reference types="vitest" />

import tailwindcss from "@tailwindcss/vite";
import swc from 'unplugin-swc';
import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy(),
    legacy,
    swc.vite({
      exclude: [], //Default would exclude all file from ``node_modules``
      jsc: {
        minify: {
          compress: true,
          mangle: true,
          //Suggested by ``capacitor-sqlite``
          keep_classnames: true,
          keep_fnames: true,
        },
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
});
