import type { MetadataRoute } from "next";
import { getDestinations, getStories } from "@/lib/data/queries";
import { absoluteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [destinations, stories] = await Promise.all([
    getDestinations(),
    getStories(),
  ]);

  const staticPages = ["", "/about", "/journeys", "/destinations", "/stories", "/photos", "/videos", "/map"].map(
    (path) => ({
      url: absoluteUrl(path),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })
  );

  const destinationPages = destinations.map((d) => ({
    url: absoluteUrl(`/destinations/${d.slug}`),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const storyPages = stories.map((s) => ({
    url: absoluteUrl(`/stories/${s.slug}`),
    lastModified: new Date(s.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...destinationPages, ...storyPages];
}
