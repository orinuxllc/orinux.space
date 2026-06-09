import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://orinux.space",
  integrations: [svelte(), sitemap()],
  // Vercel adapter: public pages are prerendered (output: "static"); the CMS
  // API routes and /preview opt into on-demand SSR via `export const prerender = false`.
  adapter: vercel(),
  output: "static",
});
