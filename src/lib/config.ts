import type { SocialLink } from "@/types";

function env(key: string, fallback = ""): string {
  return process.env[key] ?? fallback;
}

export const siteDisplayName = "Normad on two wheels";

export function seoPageTitle(pageTitle: string): string {
  return `${pageTitle} — ${siteDisplayName}`;
}

export const siteConfig = {
  url: env("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  title: env("NEXT_PUBLIC_SITE_TITLE", siteDisplayName),
  description: env(
    "NEXT_PUBLIC_SITE_DESCRIPTION",
    "Motorcycle journeys across India — road notes, photographs, and stories from two wheels."
  ),
  contactEmail: env(
    "NEXT_PUBLIC_CONTACT_EMAIL",
    "battlegroundsmobileindia69@gmail.com"
  ),
  mapboxToken: env("NEXT_PUBLIC_MAPBOX_TOKEN").trim(),
  creatorEmail: env("CREATOR_EMAIL", "creator@example.com"),
};

/** Read at request time on the server (from `.env`); pass into client map components. */
export function getMapboxToken(): string {
  return (process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "").trim();
}

const PLACEHOLDER_CONTACT_EMAILS = new Set([
  "",
  "hello@example.com",
  "ride@normadontwowheels.com",
]);

/** Replace leftover template contact emails from CMS or env. */
export function normalizeContactEmail(email: string | undefined | null): string {
  const trimmed = (email ?? "").trim();
  if (PLACEHOLDER_CONTACT_EMAILS.has(trimmed)) return siteConfig.contactEmail;
  return trimmed || siteConfig.contactEmail;
}

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

/** Env/CMS links plus a muted Instagram icon when no profile URL is set yet. */
export function resolveSocialLinks(cmsLinks: SocialLink[]): SocialLink[] {
  const envLinks = getSocialLinks();
  const base = cmsLinks.length > 0 ? cmsLinks : envLinks;
  const withUrl = base.filter((l) => l.url.trim());

  const instagram =
    withUrl.find((l) => l.platform === "instagram") ??
    envLinks.find((l) => l.platform === "instagram");

  if (instagram?.url.trim()) {
    const rest = withUrl.filter((l) => l.platform !== "instagram");
    return [...rest, instagram];
  }

  const rest = withUrl.filter((l) => l.platform !== "instagram");
  return [...rest, { platform: "instagram", url: "" }];
}

/** Username segment from an Instagram profile URL, if present. */
export function parseInstagramHandle(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  try {
    const path = new URL(trimmed).pathname.replace(/^\/+|\/+$/g, "");
    const segment = path.split("/").filter(Boolean)[0];
    if (!segment || ["p", "reel", "reels", "stories", "explore"].includes(segment)) {
      return null;
    }
    return segment;
  } catch {
    const match = trimmed.match(/instagram\.com\/([^/?#]+)/i);
    return match?.[1] ?? null;
  }
}

/** Label shown beside the Instagram icon (e.g. @normad_on_two_wheels). */
export function instagramDisplayLabel(url: string): string {
  const fromEnv = env("NEXT_PUBLIC_INSTAGRAM_HANDLE").replace(/^@/, "");
  if (fromEnv) return `@${fromEnv}`;
  const handle =
    parseInstagramHandle(url) ??
    parseInstagramHandle(env("NEXT_PUBLIC_INSTAGRAM_URL"));
  if (handle) return `@${handle}`;
  return "Instagram";
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
