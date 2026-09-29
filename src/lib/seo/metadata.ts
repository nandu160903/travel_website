import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { absoluteUrl } from "@/lib/utils";

interface PageMeta {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
}

export function createMetadata({
  title,
  description,
  path = "",
  image,
  type = "website",
  publishedTime,
}: PageMeta): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ?? absoluteUrl("/og-default.jpg");

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.title,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type,
      ...(publishedTime && { publishedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function storyJsonLd(story: {
  title: string;
  excerpt: string;
  slug: string;
  coverImage: string;
  publishedAt: string;
  readingTime: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: story.title,
    description: story.excerpt,
    image: story.coverImage,
    datePublished: story.publishedAt,
    author: {
      "@type": "Person",
      name: siteConfig.title,
    },
    url: absoluteUrl(`/stories/${story.slug}`),
    timeRequired: `PT${story.readingTime}M`,
  };
}

export function destinationJsonLd(dest: {
  name: string;
  description: string;
  slug: string;
  coverImage: string;
  coordinates?: { lat: number; lng: number };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: dest.name,
    description: dest.description,
    image: dest.coverImage,
    url: absoluteUrl(`/destinations/${dest.slug}`),
    ...(dest.coordinates && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: dest.coordinates.lat,
        longitude: dest.coordinates.lng,
      },
    }),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}
