# Horizon Journal

A premium personal travel storytelling platform — cinematic editorial site combined with a hidden creator studio.

Built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS 4**, **Motion**, **Supabase**, and **Mapbox**.

## Features

### Public Experience
- Cinematic homepage with hero, timeline, destinations, stories, photos, map
- Editorial destination explorer with asymmetric layouts
- Travel stories with rich reading experience, galleries, share buttons
- Photo gallery with masonry grid and fullscreen lightbox
- Video stories with cinematic embeds
- Interactive world map (Mapbox)
- Command-style search (`/` keyboard shortcut)
- Dark mode with smooth transitions
- Custom cursor (desktop)
- SEO: dynamic metadata, JSON-LD, sitemap, robots.txt

### Creator Studio (Hidden)
- **Secret access:** Click logo 5 times within 2 seconds → "Enter Creator Access" modal
- **Secondary access:** `/vault` (not linked in navigation)
- **Keyboard shortcut:** `Cmd/Ctrl + Shift + K` (undocumented)
- Full dashboard: trips, destinations, stories, photos, videos, map, media, settings
- Tiptap rich-text editor with autosave
- Media library with upload support
- Draft/publish workflow

## Project Structure

```
video-website/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Homepage
│   │   ├── about/
│   │   ├── journeys/
│   │   ├── destinations/
│   │   ├── stories/
│   │   ├── photos/
│   │   ├── videos/
│   │   ├── map/
│   │   ├── vault/              # Hidden auth entry
│   │   ├── studio/             # Creator dashboard
│   │   └── api/                # API routes
│   ├── components/
│   │   ├── animation/          # Reveal, AnimatedText, Parallax
│   │   ├── cards/              # Story, Destination, Trip, Photo, Video
│   │   ├── creator/            # Auth modal
│   │   ├── gallery/            # Lightbox, PhotosGallery
│   │   ├── layout/             # Header, Footer, Logo
│   │   ├── map/                # TravelMap
│   │   ├── sections/           # Hero, Timeline
│   │   ├── studio/             # Sidebar, Editor, StatCard
│   │   └── ui/                 # Button, Badge, Modal
│   ├── lib/
│   │   ├── data/               # Demo data + Supabase queries
│   │   ├── supabase/           # Client, server, middleware
│   │   ├── seo/                # Metadata helpers
│   │   └── animations/         # Motion variants
│   └── types/                  # TypeScript interfaces
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── .env.example
└── README.md
```

## Installation

```bash
# Clone and install
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

The site runs immediately with **demo content** — no Supabase required for local preview.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Production URL (e.g. `https://yoursite.vercel.app`) |
| `NEXT_PUBLIC_SITE_TITLE` | Site name |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | Default meta description |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server only) |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox public token |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Instagram profile URL |
| `NEXT_PUBLIC_FACEBOOK_URL` | Facebook profile URL |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Contact email |

## Supabase Setup

### 1. Create Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy URL and anon key to `.env.local`

### 2. Run Database Migration
Open **SQL Editor** in Supabase dashboard and run:

```
supabase/migrations/001_initial_schema.sql
```

This creates all tables, RLS policies, indexes, and triggers.

### 3. Create Storage Bucket
1. Go to **Storage** → Create bucket named `media`
2. Set as **public** for image serving
3. Add storage policies (included as comments in migration SQL)

### 4. Create Creator Account
1. Go to **Authentication** → **Users** → **Add user**
2. Set email and password for your creator account
3. The trigger auto-creates a profile with `creator` role

### 5. Insert Default Settings (optional)
```sql
INSERT INTO site_settings (site_title, site_description, bio, hero_image, email)
VALUES (
  'Horizon Journal',
  'Stories, photographs and memories from everywhere the road takes me.',
  'Your bio here',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=2400&q=85',
  'hello@example.com'
);
```

## Database Schema

| Table | Purpose |
|-------|---------|
| `profiles` | Creator/admin users (extends auth.users) |
| `site_settings` | Site title, bio, hero, social links, SEO |
| `destinations` | Countries/regions |
| `cities` | Cities within destinations |
| `trips` | Travel journeys with dates, cover, gallery |
| `stories` | Rich-text travel stories with draft/publish |
| `photos` | Image metadata and storage paths |
| `videos` | Video embeds and metadata |
| `map_locations` | Map pins for countries, cities, trips |
| `categories` | Story categories |
| `tags` | Content tags |
| `social_links` | Social media URLs |
| `newsletter_subscribers` | Email subscriptions |

**Security:** Row Level Security ensures public users can only read published content. Only authenticated creators can create, edit, delete, and upload.

## Local Development

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

### Without Supabase
The app uses demo data from `src/lib/data/demo.ts`. All public pages work out of the box.

### With Supabase
Set env variables and the data layer in `src/lib/data/queries.ts` will fetch from Supabase, falling back to demo data if tables are empty.

## Production Deployment (Vercel)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.example`
4. Deploy

```bash
# Or deploy via CLI
npx vercel --prod
```

Set `NEXT_PUBLIC_SITE_URL` to your production domain.

## Creator Access

### Primary (Secret)
1. Click the site **logo 5 times within 2 seconds**
2. Enter creator email and password in the modal
3. Redirected to `/studio`

### Secondary
Navigate directly to `/vault` — same authentication modal.

### Keyboard Shortcut
`Cmd + Shift + K` (Mac) or `Ctrl + Shift + K` (Windows/Linux)

> **Important:** Secret access is discovery only. Real security is Supabase Auth + RLS + protected API routes.

## How to Add a New Journey

1. Access Studio (`/studio` after authentication)
2. Go to **Journeys** → **New Trip**
3. Fill in: title, country, cities, dates, cover image, description, category, coordinates
4. Set status to **Published** when ready
5. Optionally mark as **Featured** for homepage display

## How to Publish a Story

1. Access Studio → **Stories** → **New Story**
2. Write title (slug auto-generates), excerpt, cover image
3. Select category and destination
4. Write content in the rich-text editor (autosaves every 30s)
5. Click **Save Draft** to save without publishing
6. Click **Preview** to see the public view
7. Click **Publish** to make it live

Published stories appear on `/stories` and the homepage. Only published content is visible to visitors.

## Demo Content

All initial content is clearly fictional demo material (Japan, Iceland, Bali, Singapore, India, Italy). Replace via Studio or Supabase dashboard.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Motion
- **Backend:** Supabase (PostgreSQL, Auth, Storage, RLS)
- **Editor:** Tiptap
- **Maps:** Mapbox GL
- **Icons:** Lucide React
- **Deployment:** Vercel
