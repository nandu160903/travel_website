import type { SocialLink } from "@/types";

function env(key: string, fallback = ""): string {
  return process.env[key] ?? fallback;
}

export const siteConfig = {
  url: env("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  title: env("NEXT_PUBLIC_SITE_TITLE", "Horizon Journal"),
  description: env(
    "NEXT_PUBLIC_SITE_DESCRIPTION",
    "Stories, photographs and memories from everywhere the road takes me."
  ),
  contactEmail: env("NEXT_PUBLIC_CONTACT_EMAIL", "hello@example.com"),
  mapboxToken: env("NEXT_PUBLIC_MAPBOX_TOKEN"),
  creatorEmail: env("CREATOR_EMAIL", "creator@example.com"),
};

export function getSocialLinks(): SocialLink[] {
  const links: SocialLink[] = [];

  const instagram = env("NEXT_PUBLIC_INSTAGRAM_URL");
  const facebook = env("NEXT_PUBLIC_FACEBOOK_URL");
  const youtube = env("NEXT_PUBLIC_YOUTUBE_URL");
  const x = env("NEXT_PUBLIC_X_URL");
  const threads = env("NEXT_PUBLIC_THREADS_URL");
  const tiktok = env("NEXT_PUBLIC_TIKTOK_URL");

  if (instagram) links.push({ platform: "instagram", url: instagram });
  if (facebook) links.push({ platform: "facebook", url: facebook });
  if (youtube) links.push({ platform: "youtube", url: youtube });
  if (x) links.push({ platform: "x", url: x });
  if (threads) links.push({ platform: "threads", url: threads });
  if (tiktok) links.push({ platform: "tiktok", url: tiktok });

  return links;
}

export const storyCategories = [
  { slug: "adventures", label: "Adventures" },
  { slug: "city", label: "City" },
  { slug: "food", label: "Food" },
  { slug: "culture", label: "Culture" },
  { slug: "nature", label: "Nature" },
  { slug: "road-trips", label: "Road Trips" },
  { slug: "personal", label: "Personal Stories" },
] as const;

export const animationConfig = {
  duration: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.8,
    cinematic: 1.2,
  },
  ease: [0.22, 1, 0.36, 1] as const,
};
