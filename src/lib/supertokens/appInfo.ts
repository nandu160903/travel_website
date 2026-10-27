/** Site origin for SuperTokens (no trailing slash). */
export function resolveWebsiteDomain(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  // Vercel sets this automatically — helps when env vars were missing at first deploy
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return `https://${vercel.replace(/\/$/, "")}`;
  }
  return "http://localhost:3000";
}

const websiteDomain = resolveWebsiteDomain();

export const appInfo = {
  appName: "Normad on two wheels",
  apiDomain: websiteDomain,
  websiteDomain,
  apiBasePath: "/api/auth",
  websiteBasePath: "/auth",
};

/** Client-only: always use the browser origin (fixes stale localhost in built JS). */
export function getClientAppInfo() {
  if (typeof window === "undefined") {
    return appInfo;
  }
  const origin = window.location.origin;
  return {
    ...appInfo,
    apiDomain: origin,
    websiteDomain: origin,
  };
}
