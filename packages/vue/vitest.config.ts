import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./test/setup.ts",
    typecheck: {
      enabled: true,
      ignoreSourceErrors: true,
    },
  },
});
