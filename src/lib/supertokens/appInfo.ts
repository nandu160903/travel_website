const websiteDomain =
  process.env.NEXT_PUBLIC_APP_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  "http://localhost:3000";

const apiDomain = websiteDomain;

export const appInfo = {
  appName: "Normad on two wheels",
  apiDomain,
  websiteDomain,
  apiBasePath: "/api/auth",
  websiteBasePath: "/auth",
};
