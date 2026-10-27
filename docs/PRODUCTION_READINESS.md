# Normad — production readiness notes

Last updated from codebase audit. Re-run `npm run verify:supabase` after changing env or Supabase dashboard settings.

## Supabase connection (verified locally)

| Check | Result |
|--------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` set | Yes |
| Anon/publishable key REST access | **OK** — `site_settings` query succeeded |
| `site_settings` rows | **0** (empty project → public site uses `demo.ts` fallback) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Not set** in `.env` — Studio writes/uploads cannot be verified end-to-end |
| Storage bucket listing | **Skipped** (requires service role) |

## Schema ↔ app mapping

| Feature | Table(s) | Notes |
|---------|-----------|--------|
| Site settings, social links | `site_settings.social_links` | Single-row pattern |
| Destinations / cities | `destinations`, `cities` | Slug-based URLs |
| Journeys | `trips` | `publish_status` |
| Stories | `stories` | HTML sanitized on write |
| Photos / videos | `photos`, `videos` | `storage_path` on photos; no binary in Postgres |
| Map pins | `map_locations` + derived pins from published content | |
| Tags / categories | `tags`, `categories` | Partially used in app |
| About page | **Local CMS file only** | `persistAboutPage` does not write to Supabase yet |
| Newsletter | `newsletter_subscribers` | Public INSERT via RLS |

Migrations: `001_initial_schema.sql`, `002_security_hardening.sql`, `003_production_storage_rls.sql`.

**Do not apply `003` to production without review** — it replaces several RLS policies. Take a backup first.

## Storage buckets (dashboard action required)

Expected buckets:

- **`travel-public`** — public read; published media.
- **`travel-private`** — private; draft uploads (signed URLs from Studio API).
- **`media`** — legacy; upload API falls back here if `travel-public` is missing.

Create buckets in Supabase → Storage, then apply migration `003` (or equivalent policies).

## Creator auth model

- **Hidden URLs** (`NEXT_PUBLIC_STUDIO_*`) — obscurity only; middleware enforces auth.
- **SuperTokens** (default) + `ADMIN_EMAIL` / `ADMIN_USER_ID` — Studio API/UI gate.
- **Supabase Auth** — optional; middleware checks `profiles.role` when SuperTokens disabled.
- **Server-side CMS writes** use `SUPABASE_SERVICE_ROLE_KEY` via `createStudioSupabaseClient()` when set (required for SuperTokens + Supabase combo).

Never put the service role key in `NEXT_PUBLIC_*`.

## Manual checklist before go-live

1. Set `SUPABASE_SERVICE_ROLE_KEY` in hosting env (server-only).
2. Apply migrations `001` → `002` → `003` on the Supabase project (after backup).
3. Create storage buckets and set `STUDIO_STORAGE_*` if names differ.
4. Promote one admin profile in `profiles.role` if using Supabase Auth instead of service role.
5. Replace `SUPERTOKENS_CONNECTION_URI=https://try.supertokens.io` with self-hosted or production core.
6. Set strong obscured `NEXT_PUBLIC_STUDIO_*` paths (invalid chars in env fall back to defaults).
7. Seed or publish content via Studio so empty tables do not keep serving demo fallback.
8. Configure production `NEXT_PUBLIC_SITE_URL`, Mapbox, OpenRouter keys.
