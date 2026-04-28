import { MetadataRoute } from "next";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://simplyexpat.de";

// Explicitly listed so each AI indexer finds its own entry (belt-and-suspenders over the * rule)
const AI_BOTS = [
  "GPTBot",          // ChatGPT / OpenAI Search
  "OAI-SearchBot",   // ChatGPT browse-the-web plugin
  "Google-Extended", // Gemini / Google AI Overviews
  "PerplexityBot",   // Perplexity AI
  "ClaudeBot",       // Anthropic Claude
  "anthropic-ai",    // Anthropic web crawler
  "Applebot-Extended", // Apple AI features
  "Bytespider",      // ByteDance / TikTok AI
  "cohere-ai",       // Cohere
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      // Explicit allow for every major AI crawler
      ...AI_BOTS.map((bot) => ({
        userAgent: bot,
        allow: "/",
        disallow: [] as string[],
      })),
    ],
    sitemap: `${DOMAIN}/sitemap.xml`,
    host: DOMAIN,
  };
}
