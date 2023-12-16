
import { defineConfig } from "tsup";

export default defineConfig({
  entryPoints: ["src/**/*.ts"],
  format: ["cjs", "esm"],
  outDir: "out",
  dts: true,
  clean: true,
  target: "es6",
});
