/** Obscured studio / admin URL segments (security through obscurity + real auth). */

const SEGMENT = /^[a-z0-9][a-z0-9-]{4,48}[a-z0-9]$/i;

const DEFAULT_BASE = "nw-cms-k9m2x7";
const DEFAULT_AUTH = "nw-gate-p4h8q1";
const DEFAULT_API = "nw-api-v6n3r2";
const DEFAULT_SITEMAP = "nw-index-z8w1c4";

function normalizeSegment(raw: string | undefined, fallback: string): string {
  const trimmed = (raw ?? fallback).trim().replace(/^\/+|\/+$/g, "");
  if (!SEGMENT.test(trimmed)) {
    return fallback;
  }
  return trimmed.toLowerCase();
}

export type StudioPathsConfig = {
  studioBase: string;
  studioAuth: string;
  studioApiRoot: string;
  sitemapPublic: string;
  blockLegacy: boolean;
};

export function getStudioPaths(): StudioPathsConfig {
  const base = normalizeSegment(
    process.env.NEXT_PUBLIC_STUDIO_BASE_PATH ?? process.env.STUDIO_BASE_PATH,
    DEFAULT_BASE
  );
  const auth = normalizeSegment(
    process.env.NEXT_PUBLIC_STUDIO_AUTH_PATH ?? process.env.STUDIO_AUTH_PATH,
    DEFAULT_AUTH
  );
  const api = normalizeSegment(
    process.env.NEXT_PUBLIC_STUDIO_API_PREFIX ?? process.env.STUDIO_API_PREFIX,
    DEFAULT_API
  );
  const sitemap = normalizeSegment(
    process.env.NEXT_PUBLIC_SITEMAP_PATH ?? process.env.SITEMAP_PATH,
    DEFAULT_SITEMAP
  );

  return {
    studioBase: `/${base}`,
    studioAuth: `/${auth}`,
    studioApiRoot: `/api/${api}`,
    sitemapPublic: `/${sitemap}`,
    blockLegacy: process.env.STUDIO_ALLOW_LEGACY_PATHS !== "true",
  };
}

/** Public CMS page path (e.g. /nw-cms-…/trips). */
export function studioPagePath(subpath = ""): string {
  const { studioBase } = getStudioPaths();
  if (!subpath) {
    return studioBase;
  }
  const suffix = subpath.startsWith("/") ? subpath : `/${subpath}`;
  return `${studioBase}${suffix}`;
}

/** Public studio API path (e.g. /api/nw-api-…/media). */
export function studioApiPath(subpath = ""): string {
  const { studioApiRoot } = getStudioPaths();
  if (!subpath) {
    return studioApiRoot;
  }
  const suffix = subpath.startsWith("/") ? subpath : `/${subpath}`;
  return `${studioApiRoot}${suffix}`;
}

export function studioAuthPath(query?: Record<string, string>): string {
  const { studioAuth } = getStudioPaths();
  if (!query || Object.keys(query).length === 0) {
    return studioAuth;
  }
  const params = new URLSearchParams(query);
  return `${studioAuth}?${params.toString()}`;
}

/** Map public URL to internal Next.js route (/studio, /auth/studio, /api/studio). */
export function resolveInternalPathname(pathname: string): string | null {
  const paths = getStudioPaths();

  if (pathname === paths.studioAuth || pathname.startsWith(`${paths.studioAuth}/`)) {
    return "/auth/studio";
  }

  if (pathname === paths.studioBase || pathname.startsWith(`${paths.studioBase}/`)) {
    const rest = pathname.slice(paths.studioBase.length);
    return `/studio${rest}`;
  }

  if (pathname === paths.studioApiRoot || pathname.startsWith(`${paths.studioApiRoot}/`)) {
    const rest = pathname.slice(paths.studioApiRoot.length);
    return `/api/studio${rest}`;
  }

  return null;
}

export function internalPathToPublic(pathname: string): string {
  const paths = getStudioPaths();

  if (pathname === "/auth/studio" || pathname.startsWith("/auth/studio/")) {
    return paths.studioAuth;
  }

  if (pathname === "/studio" || pathname.startsWith("/studio/")) {
    const rest = pathname.slice("/studio".length);
    return `${paths.studioBase}${rest}`;
  }

  return pathname;
}

export function isBlockedLegacyPath(pathname: string): boolean {
  const paths = getStudioPaths();
  if (!paths.blockLegacy) {
    return false;
  }

  if (pathname === "/vault" || pathname.startsWith("/vault/")) {
    return true;
  }
  if (pathname === "/auth/studio" || pathname.startsWith("/auth/studio/")) {
    return true;
  }
  if (pathname === "/studio" || pathname.startsWith("/studio/")) {
    return true;
  }
  if (pathname === "/api/studio" || pathname.startsWith("/api/studio/")) {
    return true;
  }

  return false;
}

export function isPublicStudioPath(pathname: string): boolean {
  const paths = getStudioPaths();
  return (
    pathname === paths.studioBase ||
    pathname.startsWith(`${paths.studioBase}/`) ||
    pathname === paths.studioAuth ||
    pathname.startsWith(`${paths.studioAuth}/`)
  );
}

export function isPublicStudioApiPath(pathname: string): boolean {
  const { studioApiRoot } = getStudioPaths();
  return pathname === studioApiRoot || pathname.startsWith(`${studioApiRoot}/`);
}
