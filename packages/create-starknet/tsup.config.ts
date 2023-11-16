import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  splitting: false,
  sourcemap: false,
  dts: false,
  clean: true,
  format: ["cjs"],
});
