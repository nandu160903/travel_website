import type {
  City,
  DashboardStats,
  Destination,
  MapLocation,
  Photo,
  SiteSettings,
  Story,
  TimelineEntry,
  Trip,
  Video,
} from "@/types";

/** Demo content — clearly fictional placeholders for development */
export const demoSettings: SiteSettings = {
  siteTitle: "Horizon Journal",
  siteDescription:
    "Stories, photographs and memories from everywhere the road takes me.",
  bio: "A wanderer with a camera, documenting the world one horizon at a time.",
  profilePhoto:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  heroImage:
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=2400&q=85",
  email: "hello@example.com",
  socialLinks: [
    {
      platform: "instagram",
      url: "https://instagram.com/YOUR_USERNAME",
    },
    { platform: "facebook", url: "https://facebook.com/YOUR_USERNAME" },
  ],
  seoDefaults: {
    title: "Horizon Journal — Travel Stories & Photography",
    description:
      "Explore destinations, travel stories, and cinematic photography from journeys around the world.",
    ogImage:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=85",
  },
  featuredDestinationIds: ["dest-japan", "dest-iceland", "dest-bali"],
};

export const demoDestinations: Destination[] = [
  {
    id: "dest-japan",
    slug: "japan",
    name: "Japan",
    country: "Japan",
    region: "East Asia",
    description:
      "Ancient temples, neon-lit streets, and the quiet poetry of everyday life.",
    coverImage:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=85",
    coordinates: { lat: 35.6762, lng: 139.6503 },
    featured: true,
    storyCount: 3,
    photoCount: 48,
    status: "published",
  },
  {
    id: "dest-iceland",
    slug: "iceland",
    name: "Iceland",
    country: "Iceland",
    region: "Europe",
    description:
      "Volcanic landscapes, northern lights, and roads that disappear into mist.",
    coverImage:
      "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=1200&q=85",
    coordinates: { lat: 64.9631, lng: -19.0208 },
    featured: true,
    storyCount: 2,
    photoCount: 36,
    status: "published",
  },
  {
    id: "dest-bali",
    slug: "bali",
    name: "Bali",
    country: "Indonesia",
    region: "Southeast Asia",
    description: "Rice terraces, ocean temples, and mornings painted in gold.",
    coverImage:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=85",
    coordinates: { lat: -8.4095, lng: 115.1889 },
    featured: true,
    storyCount: 2,
    photoCount: 42,
    status: "published",
  },
  {
    id: "dest-singapore",
    slug: "singapore",
    name: "Singapore",
    country: "Singapore",
    region: "Southeast Asia",
    description: "A city of gardens, hawker stalls, and endless vertical light.",
    coverImage:
      "https://images.unsplash.com/photo-1525621486885-2a9e327eafac?w=1200&q=85",
    coordinates: { lat: 1.3521, lng: 103.8198 },
    featured: false,
    storyCount: 1,
    photoCount: 24,
    status: "published",
  },
  {
    id: "dest-india",
    slug: "india",
    name: "India",
    country: "India",
    region: "South Asia",
    description: "Color, chaos, devotion, and the warmth of a billion stories.",
    coverImage:
      "https://images.unsplash.com/photo-1524492412937-28028a0437a8?w=1200&q=85",
    coordinates: { lat: 28.6139, lng: 77.209 },
    featured: false,
    storyCount: 2,
    photoCount: 56,
    status: "published",
  },
  {
    id: "dest-italy",
    slug: "italy",
    name: "Italy",
    country: "Italy",
    region: "Europe",
    description: "Renaissance light, cobblestone evenings, and the art of slowing down.",
    coverImage:
      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200&q=85",
    coordinates: { lat: 41.9028, lng: 12.4964 },
    featured: false,
    storyCount: 1,
    photoCount: 32,
    status: "published",
  },
];

export const demoCities: City[] = [
  {
    id: "city-tokyo",
    slug: "tokyo",
    name: "Tokyo",
    destinationId: "dest-japan",
    destinationSlug: "japan",
    description: "Neon rivers and quiet shrines in the world's largest metropolis.",
    coverImage:
      "https://images.unsplash.com/photo-1540959733332-eab4deab2ad2?w=800&q=85",
    coordinates: { lat: 35.6762, lng: 139.6503 },
    storyCount: 1,
    photoCount: 18,
  },
  {
    id: "city-kyoto",
    slug: "kyoto",
    name: "Kyoto",
    destinationId: "dest-japan",
    destinationSlug: "japan",
    description: "Bamboo groves, geisha districts, and centuries of stillness.",
    coverImage:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=85",
    coordinates: { lat: 35.0116, lng: 135.7681 },
    storyCount: 2,
    photoCount: 22,
  },
  {
    id: "city-osaka",
    slug: "osaka",
    name: "Osaka",
    destinationId: "dest-japan",
    destinationSlug: "japan",
    description: "Street food paradise and a city that never stops eating.",
    coverImage:
      "https://images.unsplash.com/photo-1590559899731-a38283987b55?w=800&q=85",
    coordinates: { lat: 34.6937, lng: 135.5023 },
    storyCount: 0,
    photoCount: 8,
  },
];

export const demoTrips: Trip[] = [
  {
    id: "trip-japan-2025",
    slug: "autumn-in-japan-2025",
    title: "Autumn in Japan",
    country: "Japan",
    cities: ["Tokyo", "Kyoto", "Osaka"],
    startDate: "2025-10-01",
    endDate: "2025-10-18",
    coverImage:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=85",
    description: "Two weeks chasing maple leaves through ancient cities.",
    category: "culture",
    coordinates: { lat: 35.0116, lng: 135.7681 },
    status: "published",
    featured: true,
    destinationId: "dest-japan",
    storyCount: 3,
    photoCount: 48,
  },
  {
    id: "trip-iceland-2025",
    slug: "iceland-ring-road-2025",
    title: "Iceland Ring Road",
    country: "Iceland",
    cities: ["Reykjavik", "Vik", "Akureyri"],
    startDate: "2025-03-10",
    endDate: "2025-03-22",
    coverImage:
      "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=1200&q=85",
    description: "Chasing auroras along the edge of the Arctic Circle.",
    category: "adventures",
    coordinates: { lat: 64.9631, lng: -19.0208 },
    status: "published",
    featured: true,
    destinationId: "dest-iceland",
    storyCount: 2,
    photoCount: 36,
  },
  {
    id: "trip-singapore-2026",
    slug: "36-hours-singapore-2026",
    title: "36 Hours in Singapore",
    country: "Singapore",
    cities: ["Singapore"],
    startDate: "2026-01-15",
    endDate: "2026-01-17",
    coverImage:
      "https://images.unsplash.com/photo-1525621486885-2a9e327eafac?w=1200&q=85",
    description: "A whirlwind of hawker centers and rooftop gardens.",
    category: "city",
    coordinates: { lat: 1.3521, lng: 103.8198 },
    status: "published",
    featured: false,
    destinationId: "dest-singapore",
    storyCount: 1,
    photoCount: 24,
  },
  {
    id: "trip-india-2026",
    slug: "rajasthan-2026",
    title: "Rajasthan Colors",
    country: "India",
    cities: ["Jaipur", "Udaipur", "Jodhpur"],
    startDate: "2026-02-01",
    endDate: "2026-02-14",
    coverImage:
      "https://images.unsplash.com/photo-1524492412937-28028a0437a8?w=1200&q=85",
    description: "Forts, palaces, and the desert at golden hour.",
    category: "culture",
    coordinates: { lat: 26.9124, lng: 75.7873 },
    status: "published",
    featured: false,
    destinationId: "dest-india",
    storyCount: 2,
    photoCount: 56,
  },
];

export const demoStories: Story[] = [
  {
    id: "story-kyoto",
    slug: "finding-silence-in-kyoto",
    title: "Finding Silence in Kyoto",
    excerpt:
      "Before dawn, the bamboo grove belongs to no one. This is a demo story — replace with your own experience.",
    content: `<p class="lead">The first light filters through bamboo stalks, painting the path in shades of jade and shadow. This is a <em>demo story</em> — a placeholder for your own travel narrative.</p>
<blockquote>Travel is the only thing you buy that makes you richer.</blockquote>
<p>Kyoto reveals itself slowly. Temple bells echo across moss-covered gardens. Tea houses hide behind unmarked doors. Every corner holds a story waiting to be told.</p>
<h2>Arashiyama at Dawn</h2>
<p>I arrived before the tour buses, when the grove was still mine alone. The sound of wind through bamboo is unlike anything else — a hollow whisper that seems to come from another century.</p>
<figure><img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1400&q=85" alt="Bamboo grove in Kyoto" /><figcaption>Early morning in Arashiyama — demo photograph</figcaption></figure>
<h2>The Art of Slow Travel</h2>
<p>In Kyoto, rushing is a sin. The city rewards patience: a perfect bowl of matcha, a hidden garden, a conversation with a shopkeeper who has lived on the same street for sixty years.</p>
<ul><li>Visit temples before 8 AM</li><li>Walk the Philosopher's Path at sunset</li><li>Find dinner in Pontocho alley</li></ul>`,
    coverImage:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1400&q=85",
    destinationId: "dest-japan",
    destinationSlug: "japan",
    destinationName: "Japan",
    cityName: "Kyoto",
    tripId: "trip-japan-2025",
    publishedAt: "2025-10-15",
    readingTime: 12,
    category: "culture",
    tags: ["kyoto", "japan", "temples", "bamboo"],
    featured: true,
    status: "published",
    gallery: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=85",
      "https://images.unsplash.com/photo-1545569341-9eb8b30993d2?w=1200&q=85",
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=85",
    ],
    location: { lat: 35.0116, lng: 135.7681 },
    seoTitle: "Finding Silence in Kyoto — Demo Travel Story",
    seoDescription:
      "A demo travel story about finding quiet moments in Kyoto, Japan.",
  },
  {
    id: "story-aurora",
    slug: "chasing-the-northern-lights",
    title: "Chasing the Northern Lights",
    excerpt:
      "Three nights on the Icelandic coast, waiting for the sky to dance. Demo content — replace with your own aurora chase.",
    content: `<p class="lead">The aurora doesn't arrive on schedule. You wait in the cold, and sometimes the sky rewards your patience.</p>
<p>This is demo content representing a journey along Iceland's south coast, hunting the northern lights between volcanic beaches and glacier lagoons.</p>
<h2>Night One — Vik</h2>
<p>Clouds. Nothing but clouds and the sound of Atlantic waves against black sand.</p>
<h2>Night Two — Jökulsárlón</h2>
<p>The clouds parted at 2 AM. Green ribbons unfurled across the sky like silk caught in wind.</p>`,
    coverImage:
      "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=1400&q=85",
    destinationId: "dest-iceland",
    destinationSlug: "iceland",
    destinationName: "Iceland",
    tripId: "trip-iceland-2025",
    publishedAt: "2025-03-20",
    readingTime: 8,
    category: "nature",
    tags: ["iceland", "aurora", "northern-lights"],
    featured: true,
    status: "published",
    location: { lat: 64.0484, lng: -16.2306 },
  },
  {
    id: "story-bali",
    slug: "one-morning-in-bali",
    title: "One Morning in Bali",
    excerpt:
      "Rice terraces at sunrise, incense in the air, and the slow rhythm of island life. Demo story.",
    content: `<p class="lead">Bali mornings begin with roosters and mist rolling over emerald terraces.</p>
<p>Demo content — replace with your own Bali experience.</p>`,
    coverImage:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1400&q=85",
    destinationId: "dest-bali",
    destinationSlug: "bali",
    destinationName: "Bali",
    publishedAt: "2025-06-12",
    readingTime: 6,
    category: "nature",
    tags: ["bali", "sunrise", "rice-terraces"],
    featured: false,
    status: "published",
    location: { lat: -8.4095, lng: 115.1889 },
  },
  {
    id: "story-singapore",
    slug: "36-hours-in-singapore",
    title: "36 Hours in Singapore",
    excerpt:
      "From hawker stalls to rooftop gardens — a compressed love letter to the Lion City. Demo story.",
    content: `<p class="lead">Singapore doesn't give you time to settle in. It pulls you forward.</p>
<p>Demo content for a short city break.</p>`,
    coverImage:
      "https://images.unsplash.com/photo-1525621486885-2a9e327eafac?w=1400&q=85",
    destinationId: "dest-singapore",
    destinationSlug: "singapore",
    destinationName: "Singapore",
    tripId: "trip-singapore-2026",
    publishedAt: "2026-01-20",
    readingTime: 10,
    category: "city",
    tags: ["singapore", "food", "city"],
    featured: false,
    status: "published",
    location: { lat: 1.3521, lng: 103.8198 },
  },
  {
    id: "story-kyoto-streets",
    slug: "lost-between-the-streets-of-kyoto",
    title: "Lost Between the Streets of Kyoto",
    excerpt:
      "Getting deliberately lost in Gion's narrow alleys. Demo story — your version awaits.",
    content: `<p class="lead">The best discoveries in Kyoto happen when you stop following the map.</p>
<p>Demo content about wandering through Gion and Higashiyama.</p>`,
    coverImage:
      "https://images.unsplash.com/photo-1545569341-9eb8b30993d2?w=1400&q=85",
    destinationId: "dest-japan",
    destinationSlug: "japan",
    destinationName: "Japan",
    cityName: "Kyoto",
    tripId: "trip-japan-2025",
    publishedAt: "2025-10-10",
    readingTime: 9,
    category: "personal",
    tags: ["kyoto", "gion", "walking"],
    featured: false,
    status: "published",
    location: { lat: 35.0038, lng: 135.7788 },
  },
  {
    id: "story-italy",
    slug: "evenings-in-florence",
    title: "Evenings in Florence",
    excerpt:
      "Golden hour over the Arno, aperitivo on the bridge. Demo story.",
    content: `<p class="lead">Florence at dusk is a painting you walk through.</p>`,
    coverImage:
      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1400&q=85",
    destinationId: "dest-italy",
    destinationSlug: "italy",
    destinationName: "Italy",
    publishedAt: "2024-09-05",
    readingTime: 7,
    category: "culture",
    tags: ["italy", "florence", "europe"],
    featured: false,
    status: "published",
    location: { lat: 43.7696, lng: 11.2558 },
  },
];

export const demoPhotos: Photo[] = [
  {
    id: "photo-1",
    url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=85",
    caption: "Bamboo grove at dawn — Kyoto, Japan (demo)",
    location: "Kyoto, Japan",
    destinationSlug: "japan",
    takenAt: "2025-10-05",
    camera: "Demo Camera · 35mm f/1.4",
    width: 1200,
    height: 1600,
  },
  {
    id: "photo-2",
    url: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=1200&q=85",
    caption: "Northern lights over Icelandic coast (demo)",
    location: "Vik, Iceland",
    destinationSlug: "iceland",
    takenAt: "2025-03-15",
    width: 1600,
    height: 1200,
  },
  {
    id: "photo-3",
    url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=85",
    caption: "Tegallalang rice terraces (demo)",
    location: "Bali, Indonesia",
    destinationSlug: "bali",
    takenAt: "2025-06-10",
    width: 1200,
    height: 1500,
  },
  {
    id: "photo-4",
    url: "https://images.unsplash.com/photo-1540959733332-eab4deab2ad2?w=1200&q=85",
    caption: "Shibuya crossing at night (demo)",
    location: "Tokyo, Japan",
    destinationSlug: "japan",
    takenAt: "2025-10-02",
    width: 1200,
    height: 800,
  },
  {
    id: "photo-5",
    url: "https://images.unsplash.com/photo-1525621486885-2a9e327eafac?w=1200&q=85",
    caption: "Marina Bay at blue hour (demo)",
    location: "Singapore",
    destinationSlug: "singapore",
    takenAt: "2026-01-16",
    width: 1200,
    height: 900,
  },
  {
    id: "photo-6",
    url: "https://images.unsplash.com/photo-1524492412937-28028a0437a8?w=1200&q=85",
    caption: "Jaipur palace at sunset (demo)",
    location: "Jaipur, India",
    destinationSlug: "india",
    takenAt: "2026-02-05",
    width: 1200,
    height: 1600,
  },
  {
    id: "photo-7",
    url: "https://images.unsplash.com/photo-1545569341-9eb8b30993d2?w=1200&q=85",
    caption: "Fushimi Inari torii gates (demo)",
    location: "Kyoto, Japan",
    destinationSlug: "japan",
    takenAt: "2025-10-08",
    width: 1200,
    height: 1800,
  },
  {
    id: "photo-8",
    url: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200&q=85",
    caption: "Florence skyline (demo)",
    location: "Florence, Italy",
    destinationSlug: "italy",
    takenAt: "2024-09-04",
    width: 1200,
    height: 800,
  },
  {
    id: "photo-9",
    url: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=85",
    caption: "Kinkaku-ji golden pavilion (demo)",
    location: "Kyoto, Japan",
    destinationSlug: "japan",
    takenAt: "2025-10-12",
    width: 1200,
    height: 900,
  },
  {
    id: "photo-10",
    url: "https://images.unsplash.com/photo-1590559899731-a38283987b55?w=1200&q=85",
    caption: "Dotonbori neon reflections (demo)",
    location: "Osaka, Japan",
    destinationSlug: "japan",
    takenAt: "2025-10-14",
    width: 1200,
    height: 800,
  },
];

export const demoVideos: Video[] = [
  {
    id: "video-1",
    title: "Kyoto in Motion",
    thumbnail:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=85",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "3:42",
    location: "Kyoto, Japan",
    destinationSlug: "japan",
    publishedAt: "2025-10-20",
    status: "published",
  },
  {
    id: "video-2",
    title: "Iceland Ring Road",
    thumbnail:
      "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&q=85",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "5:18",
    location: "Iceland",
    destinationSlug: "iceland",
    publishedAt: "2025-03-25",
    status: "published",
  },
];

export const demoTimeline: TimelineEntry[] = [
  {
    id: "tl-1",
    year: 2026,
    month: 2,
    country: "India",
    city: "Rajasthan",
    description: "Forts, deserts, and colors that refuse to fade.",
    coverImage:
      "https://images.unsplash.com/photo-1524492412937-28028a0437a8?w=800&q=85",
    destinationSlug: "india",
    storyCount: 2,
    photoCount: 56,
  },
  {
    id: "tl-2",
    year: 2026,
    month: 1,
    country: "Singapore",
    city: "Singapore",
    description: "36 hours of hawker food and vertical gardens.",
    coverImage:
      "https://images.unsplash.com/photo-1525621486885-2a9e327eafac?w=800&q=85",
    destinationSlug: "singapore",
    storyCount: 1,
    photoCount: 24,
  },
  {
    id: "tl-3",
    year: 2025,
    month: 10,
    country: "Japan",
    city: "Kyoto",
    description: "Maple leaves, temple bells, and quiet mornings.",
    coverImage:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=85",
    destinationSlug: "japan",
    storyCount: 3,
    photoCount: 48,
  },
  {
    id: "tl-4",
    year: 2025,
    month: 3,
    country: "Iceland",
    city: "South Coast",
    description: "Auroras, waterfalls, and roads into the void.",
    coverImage:
      "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&q=85",
    destinationSlug: "iceland",
    storyCount: 2,
    photoCount: 36,
  },
  {
    id: "tl-5",
    year: 2025,
    month: 6,
    country: "Indonesia",
    city: "Bali",
    description: "Terraces, temples, and slow island mornings.",
    coverImage:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=85",
    destinationSlug: "bali",
    storyCount: 2,
    photoCount: 42,
  },
  {
    id: "tl-6",
    year: 2024,
    month: 9,
    country: "Italy",
    city: "Florence",
    description: "Renaissance light and aperitivo hours.",
    coverImage:
      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=85",
    destinationSlug: "italy",
    storyCount: 1,
    photoCount: 32,
  },
];

export const demoMapLocations: MapLocation[] = [
  ...demoDestinations.map((d) => ({
    id: `map-${d.id}`,
    name: d.name,
    type: "country" as const,
    coordinates: d.coordinates!,
    coverImage: d.coverImage,
    description: d.description,
    destinationSlug: d.slug,
  })),
  ...demoCities.map((c) => ({
    id: `map-${c.id}`,
    name: c.name,
    type: "city" as const,
    coordinates: c.coordinates!,
    coverImage: c.coverImage,
    description: c.description,
    destinationSlug: c.destinationSlug,
  })),
  ...demoTrips.map((t) => ({
    id: `map-${t.id}`,
    name: t.title,
    type: "trip" as const,
    coordinates: t.coordinates!,
    coverImage: t.coverImage,
    description: t.description,
    visitDate: t.startDate,
    destinationSlug: t.destinationId?.replace("dest-", ""),
    tripSlug: t.slug,
  })),
];

export const demoDashboardStats: DashboardStats = {
  totalTrips: demoTrips.length,
  totalDestinations: demoDestinations.length,
  totalStories: demoStories.length,
  totalPhotos: demoPhotos.length,
  publishedPosts: demoStories.filter((s) => s.status === "published").length,
  draftPosts: 1,
};
