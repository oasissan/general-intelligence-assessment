import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

import robots from "astro-robots";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const site = isGithubPages
  ? "https://oasissan.github.io/general-intelligence-assessment"
  : "https://gia.steciuk.dev";
const base = isGithubPages ? "/general-intelligence-assessment" : "/";

// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale: "en",
    locales: ["en", "pl", "es", "it", "fr"],
  },
  integrations: [
    react(),
    sitemap(),
    tailwind({
      applyBaseStyles: false,
    }),
    robots(),
  ],
  site,
  base,
});
