// vite.config.ts
import { sveltekit } from "file:///C:/Users/nlclo/projects/ESP32-sveltekit/interface/node_modules/@sveltejs/kit/src/exports/vite/index.js";
import Icons from "file:///C:/Users/nlclo/projects/ESP32-sveltekit/interface/node_modules/unplugin-icons/dist/vite.mjs";

// vite-plugin-littlefs.ts
function viteLittleFS() {
  return [
    {
      name: "vite-plugin-littlefs",
      enforce: "post",
      apply: "build",
      async config(config2, _configEnv) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const { assetFileNames, chunkFileNames, entryFileNames } = (_b = (_a = config2.build) == null ? void 0 : _a.rollupOptions) == null ? void 0 : _b.output;
        config2.build.rollupOptions.output = {
          ...(_d = (_c = config2.build) == null ? void 0 : _c.rollupOptions) == null ? void 0 : _d.output,
          assetFileNames: assetFileNames.replace(".[hash]", "")
        };
        if ((_f = (_e = config2.build) == null ? void 0 : _e.rollupOptions) == null ? void 0 : _f.output.chunkFileNames.includes("hash")) {
          config2.build.rollupOptions.output = {
            ...(_h = (_g = config2.build) == null ? void 0 : _g.rollupOptions) == null ? void 0 : _h.output,
            chunkFileNames: chunkFileNames.replace(".[hash]", ""),
            entryFileNames: entryFileNames.replace(".[hash]", "")
          };
        }
      }
    }
  ];
}

// vite.config.ts
var config = {
  plugins: [
    sveltekit(),
    Icons({
      compiler: "svelte"
    }),
    // Shorten file names for LittleFS 32 char limit
    viteLittleFS()
  ],
  server: {
    proxy: {
      // Proxying REST: http://localhost:5173/rest/bar -> http://192.168.1.83/rest/bar
      "/rest": {
        target: "http://192.168.1.83",
        changeOrigin: true
      },
      // Proxying REST: http://localhost:5173/rest/bar -> http://192.168.1.83/rest/bar
      "/events": {
        target: "http://192.168.1.83",
        changeOrigin: true
      },
      // Proxying websockets ws://localhost:5173/ws -> ws://192.168.1.83/ws
      "/ws": {
        target: "ws://192.168.1.83",
        changeOrigin: true,
        ws: true
      }
    }
  }
};
var vite_config_default = config;
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAidml0ZS1wbHVnaW4tbGl0dGxlZnMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxubGNsb1xcXFxwcm9qZWN0c1xcXFxFU1AzMi1zdmVsdGVraXRcXFxcaW50ZXJmYWNlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxubGNsb1xcXFxwcm9qZWN0c1xcXFxFU1AzMi1zdmVsdGVraXRcXFxcaW50ZXJmYWNlXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9ubGNsby9wcm9qZWN0cy9FU1AzMi1zdmVsdGVraXQvaW50ZXJmYWNlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgc3ZlbHRla2l0IH0gZnJvbSAnQHN2ZWx0ZWpzL2tpdC92aXRlJztcclxuaW1wb3J0IHR5cGUgeyBVc2VyQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCBJY29ucyBmcm9tICd1bnBsdWdpbi1pY29ucy92aXRlJztcclxuaW1wb3J0IHZpdGVMaXR0bGVGUyBmcm9tICcuL3ZpdGUtcGx1Z2luLWxpdHRsZWZzJztcclxuXHJcbmNvbnN0IGNvbmZpZzogVXNlckNvbmZpZyA9IHtcclxuXHRwbHVnaW5zOiBbXHJcblx0XHRzdmVsdGVraXQoKSxcclxuXHRcdEljb25zKHtcclxuXHRcdFx0Y29tcGlsZXI6ICdzdmVsdGUnXHJcblx0XHR9KSxcclxuXHRcdC8vIFNob3J0ZW4gZmlsZSBuYW1lcyBmb3IgTGl0dGxlRlMgMzIgY2hhciBsaW1pdFxyXG5cdFx0dml0ZUxpdHRsZUZTKClcclxuXHRdLFxyXG5cdHNlcnZlcjoge1xyXG5cdFx0cHJveHk6IHtcclxuXHRcdFx0Ly8gUHJveHlpbmcgUkVTVDogaHR0cDovL2xvY2FsaG9zdDo1MTczL3Jlc3QvYmFyIC0+IGh0dHA6Ly8xOTIuMTY4LjEuODMvcmVzdC9iYXJcclxuXHRcdFx0Jy9yZXN0Jzoge1xyXG5cdFx0XHRcdHRhcmdldDogJ2h0dHA6Ly8xOTIuMTY4LjEuODMnLFxyXG5cdFx0XHRcdGNoYW5nZU9yaWdpbjogdHJ1ZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHQvLyBQcm94eWluZyBSRVNUOiBodHRwOi8vbG9jYWxob3N0OjUxNzMvcmVzdC9iYXIgLT4gaHR0cDovLzE5Mi4xNjguMS44My9yZXN0L2JhclxyXG5cdFx0XHQnL2V2ZW50cyc6IHtcclxuXHRcdFx0XHR0YXJnZXQ6ICdodHRwOi8vMTkyLjE2OC4xLjgzJyxcclxuXHRcdFx0XHRjaGFuZ2VPcmlnaW46IHRydWVcclxuXHRcdFx0fSxcclxuXHRcdFx0Ly8gUHJveHlpbmcgd2Vic29ja2V0cyB3czovL2xvY2FsaG9zdDo1MTczL3dzIC0+IHdzOi8vMTkyLjE2OC4xLjgzL3dzXHJcblx0XHRcdCcvd3MnOiB7XHJcblx0XHRcdFx0dGFyZ2V0OiAnd3M6Ly8xOTIuMTY4LjEuODMnLFxyXG5cdFx0XHRcdGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuXHRcdFx0XHR3czogdHJ1ZVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY29uZmlnO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXG5sY2xvXFxcXHByb2plY3RzXFxcXEVTUDMyLXN2ZWx0ZWtpdFxcXFxpbnRlcmZhY2VcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXG5sY2xvXFxcXHByb2plY3RzXFxcXEVTUDMyLXN2ZWx0ZWtpdFxcXFxpbnRlcmZhY2VcXFxcdml0ZS1wbHVnaW4tbGl0dGxlZnMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL25sY2xvL3Byb2plY3RzL0VTUDMyLXN2ZWx0ZWtpdC9pbnRlcmZhY2Uvdml0ZS1wbHVnaW4tbGl0dGxlZnMudHNcIjtpbXBvcnQgdHlwZSB7IFVzZXJDb25maWcsIFBsdWdpbiB9IGZyb20gJ3ZpdGUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdml0ZUxpdHRsZUZTKCk6IFBsdWdpbltdIHtcclxuXHRyZXR1cm4gW1xyXG5cdFx0e1xyXG5cdFx0XHRuYW1lOiAndml0ZS1wbHVnaW4tbGl0dGxlZnMnLFxyXG5cdFx0XHRlbmZvcmNlOiAncG9zdCcsXHJcblx0XHRcdGFwcGx5OiAnYnVpbGQnLFxyXG5cclxuXHRcdFx0YXN5bmMgY29uZmlnKGNvbmZpZywgX2NvbmZpZ0Vudikge1xyXG5cdFx0XHRcdGNvbnN0IHsgYXNzZXRGaWxlTmFtZXMsIGNodW5rRmlsZU5hbWVzLCBlbnRyeUZpbGVOYW1lcyB9ID1cclxuXHRcdFx0XHRcdGNvbmZpZy5idWlsZD8ucm9sbHVwT3B0aW9ucz8ub3V0cHV0O1xyXG5cclxuICAgICAgICAvLyBIYW5kbGUgU2VydmVyLWJ1aWxkICsgQ2xpZW50IEFzc2V0c1xyXG4gICAgICAgIGNvbmZpZy5idWlsZC5yb2xsdXBPcHRpb25zLm91dHB1dCA9IHtcclxuICAgICAgICAgIC4uLmNvbmZpZy5idWlsZD8ucm9sbHVwT3B0aW9ucz8ub3V0cHV0LFxyXG4gICAgICAgICAgYXNzZXRGaWxlTmFtZXM6IGFzc2V0RmlsZU5hbWVzLnJlcGxhY2UoJy5baGFzaF0nLCAnJylcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEhhbmRsZSBDbGllbnQtYnVpbGRcclxuICAgICAgICBpZiAoY29uZmlnLmJ1aWxkPy5yb2xsdXBPcHRpb25zPy5vdXRwdXQuY2h1bmtGaWxlTmFtZXMuaW5jbHVkZXMoJ2hhc2gnKSkge1xyXG5cclxuICAgICAgICAgIGNvbmZpZy5idWlsZC5yb2xsdXBPcHRpb25zLm91dHB1dCA9IHtcclxuICAgICAgICAgICAgLi4uY29uZmlnLmJ1aWxkPy5yb2xsdXBPcHRpb25zPy5vdXRwdXQsXHJcbiAgICAgICAgICAgIGNodW5rRmlsZU5hbWVzOiBjaHVua0ZpbGVOYW1lcy5yZXBsYWNlKCcuW2hhc2hdJywgJycpLFxyXG4gICAgICAgICAgICBlbnRyeUZpbGVOYW1lczogZW50cnlGaWxlTmFtZXMucmVwbGFjZSgnLltoYXNoXScsICcnKSxcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICBdXHJcbn1cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFpVixTQUFTLGlCQUFpQjtBQUUzVyxPQUFPLFdBQVc7OztBQ0FILFNBQVIsZUFBMEM7QUFDaEQsU0FBTztBQUFBLElBQ047QUFBQSxNQUNDLE1BQU07QUFBQSxNQUNOLFNBQVM7QUFBQSxNQUNULE9BQU87QUFBQSxNQUVQLE1BQU0sT0FBT0EsU0FBUSxZQUFZO0FBVHBDO0FBVUksY0FBTSxFQUFFLGdCQUFnQixnQkFBZ0IsZUFBZSxLQUN0RCxXQUFBQSxRQUFPLFVBQVAsbUJBQWMsa0JBQWQsbUJBQTZCO0FBRzFCLFFBQUFBLFFBQU8sTUFBTSxjQUFjLFNBQVM7QUFBQSxVQUNsQyxJQUFHLFdBQUFBLFFBQU8sVUFBUCxtQkFBYyxrQkFBZCxtQkFBNkI7QUFBQSxVQUNoQyxnQkFBZ0IsZUFBZSxRQUFRLFdBQVcsRUFBRTtBQUFBLFFBQ3REO0FBR0EsYUFBSSxXQUFBQSxRQUFPLFVBQVAsbUJBQWMsa0JBQWQsbUJBQTZCLE9BQU8sZUFBZSxTQUFTLFNBQVM7QUFFdkUsVUFBQUEsUUFBTyxNQUFNLGNBQWMsU0FBUztBQUFBLFlBQ2xDLElBQUcsV0FBQUEsUUFBTyxVQUFQLG1CQUFjLGtCQUFkLG1CQUE2QjtBQUFBLFlBQ2hDLGdCQUFnQixlQUFlLFFBQVEsV0FBVyxFQUFFO0FBQUEsWUFDcEQsZ0JBQWdCLGVBQWUsUUFBUSxXQUFXLEVBQUU7QUFBQSxVQUN0RDtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRjs7O0FEMUJBLElBQU0sU0FBcUI7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUixVQUFVO0FBQUEsSUFDVixNQUFNO0FBQUEsTUFDTCxVQUFVO0FBQUEsSUFDWCxDQUFDO0FBQUE7QUFBQSxJQUVELGFBQWE7QUFBQSxFQUNkO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDUCxPQUFPO0FBQUE7QUFBQSxNQUVOLFNBQVM7QUFBQSxRQUNSLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxNQUNmO0FBQUE7QUFBQSxNQUVBLFdBQVc7QUFBQSxRQUNWLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxNQUNmO0FBQUE7QUFBQSxNQUVBLE9BQU87QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLElBQUk7QUFBQSxNQUNMO0FBQUEsSUFDRDtBQUFBLEVBQ0Q7QUFDRDtBQUVBLElBQU8sc0JBQVE7IiwKICAibmFtZXMiOiBbImNvbmZpZyJdCn0K
