import type {
  AboutPageContent,
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

/** Default journal content when CMS / Supabase has no rows yet. */
export const demoSettings: SiteSettings = {
  siteTitle: "Normad on two wheels",
  siteDescription:
    "Motorcycle journeys across India — road notes, photographs, and stories from the saddle.",
  bio: "I ride slow, stop often, and write down what the road teaches — high passes, monsoon ghats, and everything in between.",
  profilePhoto:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  heroImage:
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=2400&q=85",
  email: "battlegroundsmobileindia69@gmail.com",
  socialLinks: [],
  seoDefaults: {
    title: "Normad on two wheels — Motorcycle travel journal",
    description:
      "Personal journal of motorcycle trips across India: Ladakh, Himachal, Rajasthan, and the Western Ghats.",
    ogImage:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=85",
  },
  featuredDestinationIds: ["dest-ladakh", "dest-himachal", "dest-rajasthan"],
};

export const demoAboutPage: AboutPageContent = {
  headline: "The Road Is\nThe Story.\nThe Bike Is\nThe Pen.",
  subtitle: "Why I ride, what I pack, and how I remember each journey.",
  sections: [
    {
      title: "Who I Am",
      content:
        "I'm a solo motorcycle traveler based in India. I ride a simple adventure setup — nothing flashy — and I document trips the way I experience them: wind noise, chai stops, wrong turns that become the best part of the day.",
    },
    {
      title: "Why Two Wheels",
      content:
        "On a bike you feel altitude, weather, and terrain in your wrists and knees. You can't scroll past a village — you roll through it. That's the kind of travel I want to remember.",
    },
    {
      title: "How I Ride",
      content:
        "Early starts, short daily distances on mountain days, and no fixed plan beyond fuel, light, and a rough direction. I prefer secondary highways and old hill roads over racing to a checklist.",
    },
    {
      title: "Routes That Shaped Me",
      content:
        "The Manali–Leh highway taught me patience at 17,000 feet. Spiti taught me respect for cold and silence. Rajasthan taught me that heat and color can exhaust and energize you in the same hour.",
    },
    {
      title: "What I Carry",
      content:
        "Riding gear, a compact tool roll, a rain layer that actually works, a notebook, and a camera I can operate with gloved hands. Everything else is negotiable.",
    },
    {
      title: "This Website",
      content:
        "A living logbook — not a guidebook. Dates, maps, photos, and the honest notes I would send a friend asking, “Is that road worth it?”",
    },
  ],
};

export const demoDestinations: Destination[] = [
  {
    id: "dest-ladakh",
    slug: "ladakh",
    name: "Ladakh",
    country: "India",
    region: "Union Territory",
    description:
      "High passes, indigo lakes, and roads that climb until the air feels thin and clear.",
    coverImage:
      "https://images.unsplash.com/photo-1626621341517-bbf3dead7848?w=1200&q=85",
    coordinates: { lat: 34.1526, lng: 77.5771 },
    featured: true,
    storyCount: 2,
    photoCount: 34,
    status: "published",
  },
  {
    id: "dest-himachal",
    slug: "himachal-pradesh",
    name: "Himachal Pradesh",
    country: "India",
    region: "North India",
    description:
      "Pine valleys, switchback climbs, and monsoon mist on the old Hindustan–Tibet road.",
    coverImage:
      "https://images.unsplash.com/photo-1592450725960-066671492a87?w=1200&q=85",
    coordinates: { lat: 32.2396, lng: 77.1887 },
    featured: true,
    storyCount: 2,
    photoCount: 28,
    status: "published",
  },
  {
    id: "dest-rajasthan",
    slug: "rajasthan",
    name: "Rajasthan",
    country: "India",
    region: "Northwest India",
    description:
      "Desert highways, fort towns, and long golden evenings after a day in the saddle.",
    coverImage:
      "https://images.unsplash.com/photo-1524492412937-28028a0437a8?w=1200&q=85",
    coordinates: { lat: 26.9124, lng: 75.7873 },
    featured: true,
    storyCount: 1,
    photoCount: 22,
    status: "published",
  },
  {
    id: "dest-spiti",
    slug: "spiti",
    name: "Spiti Valley",
    country: "India",
    region: "Himachal Pradesh",
    description:
      "A cold desert valley — remote villages, cliff-side monasteries, and razor-edge tarmac.",
    coverImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85",
    coordinates: { lat: 32.246, lng: 78.034 },
    featured: false,
    storyCount: 1,
    photoCount: 18,
    status: "published",
  },
  {
    id: "dest-kerala",
    slug: "kerala",
    name: "Kerala & Western Ghats",
    country: "India",
    region: "South India",
    description:
      "Ghats hairpins, tea estates, and monsoon-green hills after the dry north.",
    coverImage:
      "https://images.unsplash.com/photo-1602216052126-03a1a9a5a058?w=1200&q=85",
    coordinates: { lat: 10.0889, lng: 77.0595 },
    featured: false,
    storyCount: 1,
    photoCount: 16,
    status: "published",
  },
];

export const demoCities: City[] = [
  {
    id: "city-leh",
    slug: "leh",
    name: "Leh",
    destinationId: "dest-ladakh",
    destinationSlug: "ladakh",
    description: "Acclimatization stops, butter tea, and the gateway to Khardung La.",
    coverImage:
      "https://images.unsplash.com/photo-1626621341517-bbf3dead7848?w=800&q=85",
    coordinates: { lat: 34.1526, lng: 77.5771 },
    storyCount: 1,
    photoCount: 12,
  },
  {
    id: "city-manali",
    slug: "manali",
    name: "Manali",
    destinationId: "dest-himachal",
    destinationSlug: "himachal-pradesh",
    description: "Beas river valley base camp before the climb toward Rohtang and beyond.",
    coverImage:
      "https://images.unsplash.com/photo-1592450725960-066671492a87?w=800&q=85",
    coordinates: { lat: 32.2396, lng: 77.1887 },
    storyCount: 1,
    photoCount: 10,
  },
  {
    id: "city-jaipur",
    slug: "jaipur",
    name: "Jaipur",
    destinationId: "dest-rajasthan",
    destinationSlug: "rajasthan",
    description: "Pink-city mornings and long straight runs toward the Thar.",
    coverImage:
      "https://images.unsplash.com/photo-1524492412937-28028a0437a8?w=800&q=85",
    coordinates: { lat: 26.9124, lng: 75.7873 },
    storyCount: 1,
    photoCount: 9,
  },
  {
    id: "city-munnar",
    slug: "munnar",
    name: "Munnar",
    destinationId: "dest-kerala",
    destinationSlug: "kerala",
    description: "Tea-covered hills and cool air after weeks on northern highways.",
    coverImage:
      "https://images.unsplash.com/photo-1602216052126-03a1a9a5a058?w=800&q=85",
    coordinates: { lat: 10.0889, lng: 77.0595 },
    storyCount: 1,
    photoCount: 8,
  },
];

export const demoTrips: Trip[] = [
  {
    id: "trip-leh-manali-2025",
    slug: "manali-leh-highway-2025",
    title: "Manali–Leh Highway",
    country: "India",
    cities: ["Manali", "Keylong", "Leh"],
    startDate: "2025-07-08",
    endDate: "2025-07-22",
    coverImage:
      "https://images.unsplash.com/photo-1626621341517-bbf3dead7848?w=1200&q=85",
    description:
      "Fourteen days over Rohtang, Baralacha, and the Moore plains — monsoon on one side, rain shadow on the other.",
    category: "road-trips",
    coordinates: { lat: 32.75, lng: 77.25 },
    status: "published",
    featured: true,
    destinationId: "dest-ladakh",
    storyCount: 2,
    photoCount: 34,
  },
  {
    id: "trip-spiti-2025",
    slug: "spiti-circuit-2025",
    title: "Spiti Circuit",
    country: "India",
    cities: ["Rampur", "Kaza", "Tabo"],
    startDate: "2025-09-12",
    endDate: "2025-09-20",
    coverImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85",
    description:
      "Kinnaur–Spiti loop: landslide delays, monastery afternoons, and cold nights at 3,600 m.",
    category: "adventures",
    coordinates: { lat: 32.246, lng: 78.034 },
    status: "published",
    featured: true,
    destinationId: "dest-spiti",
    storyCount: 1,
    photoCount: 18,
  },
  {
    id: "trip-rajasthan-2026",
    slug: "rajasthan-fort-roads-2026",
    title: "Rajasthan Fort Roads",
    country: "India",
    cities: ["Jaipur", "Jodhpur", "Udaipur"],
    startDate: "2026-02-01",
    endDate: "2026-02-12",
    coverImage:
      "https://images.unsplash.com/photo-1524492412937-28028a0437a8?w=1200&q=85",
    description:
      "Winter desert riding — early starts, fort towns, and NH48 stretches that hum under the front wheel.",
    category: "culture",
    coordinates: { lat: 26.9124, lng: 75.7873 },
    status: "published",
    featured: false,
    destinationId: "dest-rajasthan",
    storyCount: 1,
    photoCount: 22,
  },
  {
    id: "trip-ghats-2026",
    slug: "western-ghats-monsoon-2026",
    title: "Western Ghats Monsoon",
    country: "India",
    cities: ["Munnar", "Valparai"],
    startDate: "2026-06-18",
    endDate: "2026-06-25",
    coverImage:
      "https://images.unsplash.com/photo-1602216052126-03a1a9a5a058?w=1200&q=85",
    description:
      "A wet-week loop through tea country — low visibility, fresh waterfalls, and grip you learn to trust.",
    category: "nature",
    coordinates: { lat: 10.0889, lng: 77.0595 },
    status: "published",
    featured: false,
    destinationId: "dest-kerala",
    storyCount: 1,
    photoCount: 16,
  },
];

export const demoStories: Story[] = [
  {
    id: "story-rohtang",
    slug: "first-light-at-rohtang",
    title: "First Light at Rohtang",
    excerpt:
      "Queue at the pass, engines ticking cool, and a break in the clouds that made the whole climb worth it.",
    content: `<p class="lead">Rohtang is never only a pass — it's a mood. Trucks, tourists, locals, and a line of riders all waiting for the same gate to open.</p>
<p>I left Manali at 4:30 AM to beat the jam. The air at the top was sharp enough to feel in your teeth. For twenty minutes the world was white cloud and wet asphalt, then the sun cut a hole and the Pir Panjal range appeared all at once.</p>
<h2>Riding above the tree line</h2>
<p>Past the pass the landscape changes fast. Pine gives way to bare brown slopes and the road starts to behave like a shelf bolted to a cliff. You stop checking speed and start checking lines.</p>
<figure><img src="https://images.unsplash.com/photo-1592450725960-066671492a87?w=1400&q=85" alt="Mountain road in Himachal Pradesh" /><figcaption>Descending toward Keylong — rain on the visor, heat on the engine</figcaption></figure>
<h2>What I learned</h2>
<ul><li>Start early or accept the queue</li><li>Layer up — sun and snow share the same hour</li><li>Fill fuel when you see a pump; the next one is never "soon"</li></ul>`,
    coverImage:
      "https://images.unsplash.com/photo-1592450725960-066671492a87?w=1400&q=85",
    destinationId: "dest-himachal",
    destinationSlug: "himachal-pradesh",
    destinationName: "Himachal Pradesh",
    cityName: "Manali",
    tripId: "trip-leh-manali-2025",
    publishedAt: "2025-07-18",
    readingTime: 11,
    category: "road-trips",
    tags: ["rohtang", "manali", "himalaya", "motorcycle"],
    featured: true,
    status: "published",
    gallery: [
      "https://images.unsplash.com/photo-1592450725960-066671492a87?w=1200&q=85",
      "https://images.unsplash.com/photo-1626621341517-bbf3dead7848?w=1200&q=85",
    ],
    location: { lat: 32.371, lng: 77.133 },
    seoTitle: "First Light at Rohtang — Manali–Leh ride notes",
    seoDescription:
      "Early-morning crossing of Rohtang Pass on a motorcycle trip toward Ladakh.",
  },
  {
    id: "story-pangong",
    slug: "pangong-after-rain",
    title: "Pangong After Rain",
    excerpt:
      "The lake turned mirror-still the evening the storm passed — and the road back to Leh felt twice as long.",
    content: `<p class="lead">Everyone photographs Pangong in harsh afternoon light. I got lucky with a soft sky and an empty shore.</p>
<p>The ride out from Leh is dust and military convoys until the last climb. Then the water appears — too blue to look real, even when you're standing in it.</p>
<h2>Camping at 4,350 m</h2>
<p>Night temperature dropped fast. The bike's metal pinged as it cooled. I wrote three lines in my notebook and fell asleep to wind against nylon.</p>
<h2>Return leg</h2>
<p>Chang La on the way back was colder than the way up. I kept the throttle smooth and the mind quieter than the engine.</p>`,
    coverImage:
      "https://images.unsplash.com/photo-1626621341517-bbf3dead7848?w=1400&q=85",
    destinationId: "dest-ladakh",
    destinationSlug: "ladakh",
    destinationName: "Ladakh",
    tripId: "trip-leh-manali-2025",
    publishedAt: "2025-07-28",
    readingTime: 9,
    category: "nature",
    tags: ["pangong", "ladakh", "leh", "camping"],
    featured: true,
    status: "published",
    location: { lat: 33.75, lng: 78.68 },
  },
  {
    id: "story-spiti",
    slug: "kaza-in-september",
    title: "Kaza in September",
    excerpt:
      "Spiti after tourist season — closed guesthouses opening for one rider, and roads that reward slow speed.",
    content: `<p class="lead">September in Spiti is the valley exhaling. The rush thins out; the cold arrives in honest increments.</p>
<p>I rode in from Kinnaur with hands stiff from wind. Kaza's main street was quiet enough to hear my chain slack clink at walking pace.</p>
<p>Key Monastery on a rest day. Tabo's mud walls. A local mechanic who lent me a 10 mm socket and refused payment. That's the Spiti I'll remember.</p>`,
    coverImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=85",
    destinationId: "dest-spiti",
    destinationSlug: "spiti",
    destinationName: "Spiti Valley",
    tripId: "trip-spiti-2025",
    publishedAt: "2025-09-22",
    readingTime: 8,
    category: "adventures",
    tags: ["spiti", "kaza", "kinnaur"],
    featured: false,
    status: "published",
    location: { lat: 32.246, lng: 78.034 },
  },
  {
    id: "story-jaipur",
    slug: "jaipur-to-jodhpur-by-bike",
    title: "Jaipur to Jodhpur by Bike",
    excerpt:
      "NH48 heat, mirages on the tar, and fort silhouettes that grow taller as the day cools.",
    content: `<p class="lead">Rajasthan on a motorcycle is a lesson in rhythm — leave early, rest at noon, ride again when the light turns gold.</p>
<p>Jaipur's morning chaos fades in the mirror faster than you'd expect. Out on the highway it's wind, lorries, and the steady patience of cruise speed in heat.</p>
<p>Jodhpur appeared as a blue smudge under a fort that looks carved from the rock it sits on. Worth every liter of sweat.</p>`,
    coverImage:
      "https://images.unsplash.com/photo-1524492412937-28028a0437a8?w=1400&q=85",
    destinationId: "dest-rajasthan",
    destinationSlug: "rajasthan",
    destinationName: "Rajasthan",
    tripId: "trip-rajasthan-2026",
    publishedAt: "2026-02-08",
    readingTime: 7,
    category: "culture",
    tags: ["rajasthan", "jaipur", "jodhpur", "desert"],
    featured: false,
    status: "published",
    location: { lat: 26.9124, lng: 75.7873 },
  },
  {
    id: "story-munnar",
    slug: "munnar-hairpins",
    title: "Munnar Hairpins",
    excerpt:
      "After weeks of dry north, the Western Ghats felt like riding inside a cloud forest.",
    content: `<p class="lead">Monsoon on the ghats is not dramatic in bursts — it's constant, soft, and deeply green.</p>
<p>Hairpins stacked on hairpins. Tea pickers as dots on slopes too steep to walk straight. The bike's front tire cutting a line through mist that never fully lifts.</p>
<p>I stopped more than I rode. That was the point.</p>`,
    coverImage:
      "https://images.unsplash.com/photo-1602216052126-03a1a9a5a058?w=1400&q=85",
    destinationId: "dest-kerala",
    destinationSlug: "kerala",
    destinationName: "Kerala & Western Ghats",
    tripId: "trip-ghats-2026",
    publishedAt: "2026-06-24",
    readingTime: 6,
    category: "nature",
    tags: ["munnar", "western-ghats", "monsoon"],
    featured: false,
    status: "published",
    location: { lat: 10.0889, lng: 77.0595 },
  },
];

export const demoPhotos: Photo[] = [
  {
    id: "photo-1",
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85",
    caption: "Packed and ready — dawn departure from Manali",
    location: "Manali, Himachal Pradesh",
    destinationSlug: "himachal-pradesh",
    takenAt: "2025-07-08",
    camera: "Phone · wide lens",
    width: 1200,
    height: 1600,
  },
  {
    id: "photo-2",
    url: "https://images.unsplash.com/photo-1626621341517-bbf3dead7848?w=1200&q=85",
    caption: "High-altitude road toward Ladakh",
    location: "Ladakh",
    destinationSlug: "ladakh",
    takenAt: "2025-07-15",
    width: 1600,
    height: 1200,
  },
  {
    id: "photo-3",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85",
    caption: "Spiti valley — afternoon shadow on the ridge",
    location: "Spiti, Himachal Pradesh",
    destinationSlug: "spiti",
    takenAt: "2025-09-14",
    width: 1200,
    height: 1500,
  },
  {
    id: "photo-4",
    url: "https://images.unsplash.com/photo-1524492412937-28028a0437a8?w=1200&q=85",
    caption: "Hawa Mahal at golden hour",
    location: "Jaipur, Rajasthan",
    destinationSlug: "rajasthan",
    takenAt: "2026-02-02",
    width: 1200,
    height: 800,
  },
  {
    id: "photo-5",
    url: "https://images.unsplash.com/photo-1602216052126-03a1a9a5a058?w=1200&q=85",
    caption: "Tea slopes above Munnar",
    location: "Munnar, Kerala",
    destinationSlug: "kerala",
    takenAt: "2026-06-20",
    width: 1200,
    height: 900,
  },
  {
    id: "photo-6",
    url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=85",
    caption: "Open highway — somewhere between nowhere and next town",
    location: "India",
    takenAt: "2025-07-10",
    width: 1200,
    height: 800,
  },
  {
    id: "photo-7",
    url: "https://images.unsplash.com/photo-1592450725960-066671492a87?w=1200&q=85",
    caption: "Switchbacks in the Pir Panjal",
    location: "Himachal Pradesh",
    destinationSlug: "himachal-pradesh",
    takenAt: "2025-07-09",
    width: 1200,
    height: 1800,
  },
  {
    id: "photo-8",
    url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=85",
    caption: "Night camp — stars over a cold valley",
    location: "Ladakh",
    destinationSlug: "ladakh",
    takenAt: "2025-07-20",
    width: 1200,
    height: 800,
  },
];

export const demoVideos: Video[] = [
  {
    id: "video-1",
    title: "Manali to Leh — road clips",
    thumbnail:
      "https://images.unsplash.com/photo-1626621341517-bbf3dead7848?w=800&q=85",
    url: "https://www.youtube.com/watch?v=Scxs7L0vhZ4",
    embedUrl: "https://www.youtube.com/embed/Scxs7L0vhZ4",
    duration: "4:12",
    location: "Himachal & Ladakh",
    destinationSlug: "ladakh",
    publishedAt: "2025-08-01",
    status: "published",
  },
  {
    id: "video-2",
    title: "Spiti — Kaza side roads",
    thumbnail:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85",
    url: "https://www.youtube.com/watch?v=Scxs7L0vhZ4",
    embedUrl: "https://www.youtube.com/embed/Scxs7L0vhZ4",
    duration: "3:05",
    location: "Spiti Valley",
    destinationSlug: "spiti",
    publishedAt: "2025-10-01",
    status: "published",
  },
];

export const demoTimeline: TimelineEntry[] = [
  {
    id: "tl-1",
    year: 2026,
    month: 6,
    country: "India",
    city: "Western Ghats",
    description: "Monsoon greens and tea-estate hairpins.",
    coverImage:
      "https://images.unsplash.com/photo-1602216052126-03a1a9a5a058?w=800&q=85",
    destinationSlug: "kerala",
    storyCount: 1,
    photoCount: 16,
  },
  {
    id: "tl-2",
    year: 2026,
    month: 2,
    country: "India",
    city: "Rajasthan",
    description: "Desert highways and fort towns at dusk.",
    coverImage:
      "https://images.unsplash.com/photo-1524492412937-28028a0437a8?w=800&q=85",
    destinationSlug: "rajasthan",
    storyCount: 1,
    photoCount: 22,
  },
  {
    id: "tl-3",
    year: 2025,
    month: 9,
    country: "India",
    city: "Spiti",
    description: "Cold valleys and quiet monastery stops.",
    coverImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85",
    destinationSlug: "spiti",
    storyCount: 1,
    photoCount: 18,
  },
  {
    id: "tl-4",
    year: 2025,
    month: 7,
    country: "India",
    city: "Ladakh",
    description: "High passes, lake camps, and thin air.",
    coverImage:
      "https://images.unsplash.com/photo-1626621341517-bbf3dead7848?w=800&q=85",
    destinationSlug: "ladakh",
    storyCount: 2,
    photoCount: 34,
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
  draftPosts: 0,
};
