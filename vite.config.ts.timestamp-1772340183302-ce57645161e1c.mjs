// vite.config.ts
import tailwindcss from "file:///home/afdal/Laboratorium/PROJECT/extensionadminaksent/node_modules/@tailwindcss/vite/dist/index.mjs";
import swc from "file:///home/afdal/Laboratorium/PROJECT/extensionadminaksent/node_modules/unplugin-swc/dist/index.js";
import legacy from "file:///home/afdal/Laboratorium/PROJECT/extensionadminaksent/node_modules/@vitejs/plugin-legacy/dist/index.mjs";
import react from "file:///home/afdal/Laboratorium/PROJECT/extensionadminaksent/node_modules/@vitejs/plugin-react/dist/index.js";
import { defineConfig } from "file:///home/afdal/Laboratorium/PROJECT/extensionadminaksent/node_modules/vite/dist/node/index.js";
import path from "path";
var __vite_injected_original_dirname = "/home/afdal/Laboratorium/PROJECT/extensionadminaksent";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    legacy(),
    legacy,
    swc.vite({
      exclude: [],
      //Default would exclude all file from ``node_modules``
      jsc: {
        minify: {
          compress: true,
          mangle: true,
          //Suggested by ``capacitor-sqlite``
          keep_classnames: true,
          keep_fnames: true
        }
      }
    }),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9hZmRhbC9MYWJvcmF0b3JpdW0vUFJPSkVDVC9leHRlbnNpb25hZG1pbmFrc2VudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvYWZkYWwvTGFib3JhdG9yaXVtL1BST0pFQ1QvZXh0ZW5zaW9uYWRtaW5ha3NlbnQvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvYWZkYWwvTGFib3JhdG9yaXVtL1BST0pFQ1QvZXh0ZW5zaW9uYWRtaW5ha3NlbnQvdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XG5cbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tIFwiQHRhaWx3aW5kY3NzL3ZpdGVcIjtcbmltcG9ydCBzd2MgZnJvbSAndW5wbHVnaW4tc3djJztcbmltcG9ydCBsZWdhY3kgZnJvbSBcIkB2aXRlanMvcGx1Z2luLWxlZ2FjeVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBsZWdhY3koKSxcbiAgICBsZWdhY3ksXG4gICAgc3djLnZpdGUoe1xuICAgICAgZXhjbHVkZTogW10sIC8vRGVmYXVsdCB3b3VsZCBleGNsdWRlIGFsbCBmaWxlIGZyb20gYGBub2RlX21vZHVsZXNgYFxuICAgICAganNjOiB7XG4gICAgICAgIG1pbmlmeToge1xuICAgICAgICAgIGNvbXByZXNzOiB0cnVlLFxuICAgICAgICAgIG1hbmdsZTogdHJ1ZSxcbiAgICAgICAgICAvL1N1Z2dlc3RlZCBieSBgYGNhcGFjaXRvci1zcWxpdGVgYFxuICAgICAgICAgIGtlZXBfY2xhc3NuYW1lczogdHJ1ZSxcbiAgICAgICAgICBrZWVwX2ZuYW1lczogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgdGFpbHdpbmRjc3MoKSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICB9LFxuICB9LFxuICB0ZXN0OiB7XG4gICAgZ2xvYmFsczogdHJ1ZSxcbiAgICBlbnZpcm9ubWVudDogXCJqc2RvbVwiLFxuICAgIHNldHVwRmlsZXM6IFwiLi9zcmMvc2V0dXBUZXN0cy50c1wiLFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBRUEsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixPQUFPLFdBQVc7QUFDbEIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxVQUFVO0FBUGpCLElBQU0sbUNBQW1DO0FBVXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxJQUNQO0FBQUEsSUFDQSxJQUFJLEtBQUs7QUFBQSxNQUNQLFNBQVMsQ0FBQztBQUFBO0FBQUEsTUFDVixLQUFLO0FBQUEsUUFDSCxRQUFRO0FBQUEsVUFDTixVQUFVO0FBQUEsVUFDVixRQUFRO0FBQUE7QUFBQSxVQUVSLGlCQUFpQjtBQUFBLFVBQ2pCLGFBQWE7QUFBQSxRQUNmO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsWUFBWTtBQUFBLEVBQ2Q7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLE1BQU07QUFBQSxJQUNKLFNBQVM7QUFBQSxJQUNULGFBQWE7QUFBQSxJQUNiLFlBQVk7QUFBQSxFQUNkO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
