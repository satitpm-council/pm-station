import { defineConfig } from "tsup";
// @ts-ignore
import { getPackages } from "build-config";
import dotenv from "dotenv";
export default defineConfig({
  env: dotenv.config({ path: "../../.env" }).parsed,
  entry: ["server/dev.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  noExternal: getPackages(),
});
