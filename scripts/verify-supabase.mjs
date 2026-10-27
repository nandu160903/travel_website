/**
 * Non-destructive Supabase connectivity check (run: node scripts/verify-supabase.mjs).
 * Loads .env then .env.local if present. Never prints secret values.
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  const text = readFileSync(path, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

const root = resolve(import.meta.dirname, "..");
loadEnvFile(resolve(root, ".env"));
loadEnvFile(resolve(root, ".env.local"));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
const service = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

const report = {
  env: {
    hasUrl: Boolean(url),
    hasAnonKey: Boolean(anon),
    hasServiceRoleKey: Boolean(service),
  },
  anon: { ok: false, error: null, siteSettingsRows: null },
  service: { ok: false, error: null, tableCounts: null },
  storage: { ok: false, error: null, buckets: [] },
};

if (!url || !anon) {
  console.log(JSON.stringify({ ...report, note: "Missing NEXT_PUBLIC_SUPABASE_URL or anon key." }, null, 2));
  process.exit(1);
}

async function rest(path, key) {
  const res = await fetch(`${url}${path}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
    },
  });
  const body = await res.text();
  let json = null;
  try {
    json = body ? JSON.parse(body) : null;
  } catch {
    json = { raw: body.slice(0, 200) };
  }
  return { status: res.status, json };
}

try {
  const settings = await rest("/rest/v1/site_settings?select=id&limit=1", anon);
  report.anon.ok = settings.status >= 200 && settings.status < 300;
  if (!report.anon.ok) {
    report.anon.error = `HTTP ${settings.status}`;
  } else {
    report.anon.siteSettingsRows = Array.isArray(settings.json) ? settings.json.length : null;
  }
} catch (e) {
  report.anon.error = e instanceof Error ? e.message : "request failed";
}

if (service) {
  try {
    const tables = ["destinations", "stories", "trips", "photos", "videos"];
    const counts = {};
    for (const table of tables) {
      const r = await rest(`/rest/v1/${table}?select=id`, service);
      counts[table] =
        r.status === 200 && Array.isArray(r.json)
          ? r.json.length
          : { error: `HTTP ${r.status}` };
    }
    report.service.ok = true;
    report.service.tableCounts = counts;
  } catch (e) {
    report.service.error = e instanceof Error ? e.message : "request failed";
  }

  try {
    const r = await fetch(`${url}/storage/v1/bucket`, {
      headers: {
        apikey: service,
        Authorization: `Bearer ${service}`,
      },
    });
    const buckets = r.ok ? await r.json() : [];
    report.storage.ok = r.ok;
    if (!r.ok) report.storage.error = `HTTP ${r.status}`;
    report.storage.buckets = Array.isArray(buckets)
      ? buckets.map((b) => ({ name: b.name, public: b.public }))
      : [];
  } catch (e) {
    report.storage.error = e instanceof Error ? e.message : "request failed";
  }
} else {
  report.service.error = "SUPABASE_SERVICE_ROLE_KEY not set — skipped privileged checks.";
  report.storage.error = "SUPABASE_SERVICE_ROLE_KEY not set — skipped bucket listing.";
}

console.log(JSON.stringify(report, null, 2));
