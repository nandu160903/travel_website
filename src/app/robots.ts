import type { MetadataRoute } from "next";

/** Minimal robots.txt — no disallowed paths or sitemap URL (avoids leaking admin/obscured routes). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
  };
}
