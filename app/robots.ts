import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        // Danh sách các bot AI phổ biến cần chặn
        userAgent: [
          "GPTBot",          // OpenAI (ChatGPT)
          "OAI-SearchBot",   // OpenAI Search
          "ChatGPT-User",    // ChatGPT plugins/browsing
          "ClaudeBot",       // Anthropic (Claude)
          "Claude-Web",      // Anthropic web crawler
          "PerplexityBot",   // Perplexity AI
          "Perplexity-User", // Perplexity user crawler
          "CCBot",           // Common Crawl (dùng để train AI)
          "Amazonbot",       // Amazon AI / Alexa
          "Applebot-Extended", // Apple Intelligence
          "Bytespider",      // ByteDance / TikTok AI
          "Cohere-Ai",       // Cohere
          "Diffbot",         // Diffbot
          "FacebookBot",     // Meta AI
        ],
        disallow: ["/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}