import solid from "@astrojs/solid-js";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://ianpascoe.dev",
  output: "static",
  integrations: [solid()],
});
