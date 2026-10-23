import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["packages/*/test/**/*.spec.ts", "tools/*/test/**/*.spec.ts"],
  },
});
