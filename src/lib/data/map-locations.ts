import type { City, Coordinates, Destination, MapLocation, Trip } from "@/types";

export function normalizeCoordinates(raw: unknown): Coordinates | null {
  if (!raw) return null;

  if (Array.isArray(raw) && raw.length >= 2) {
    const lng = Number(raw[0]);
    const lat = Number(raw[1]);
    return isValidCoordinates({ lat, lng }) ? { lat, lng } : null;
  }

  if (typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    const lat = Number(o.lat ?? o.latitude);
    const lng = Number(o.lng ?? o.longitude ?? o.lon);
    return isValidCoordinates({ lat, lng }) ? { lat, lng } : null;
  }

  return null;
}

export function isValidCoordinates(c: Coordinates | undefined | null): c is Coordinates {
  if (!c) return false;
  const lat = Number(c.lat);
  const lng = Number(c.lng);
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    !(lat === 0 && lng === 0)
  );
}

function normalizeMapLocation(loc: MapLocation): MapLocation | null {
  const coordinates = normalizeCoordinates(loc.coordinates) ?? loc.coordinates;
  if (!isValidCoordinates(coordinates)) return null;
  return { ...loc, coordinates };
}

/** Pins from journeys / destinations when no manual map rows exist. */
export function mapLocationsFromContent(input: {
  destinations: Destination[];
  cities: City[];
  trips: Trip[];
}): MapLocation[] {
  const pins: MapLocation[] = [];

  for (const d of input.destinations) {
    const coordinates = normalizeCoordinates(d.coordinates);
    if (!coordinates) continue;
    pins.push({
      id: `dest-${d.id}`,
      name: d.name,
      type: "country",
      coordinates,
      coverImage: d.coverImage,
      description: d.description,
      destinationSlug: d.slug,
    });
  }

  for (const c of input.cities) {
    const coordinates = normalizeCoordinates(c.coordinates);
    if (!coordinates) continue;
    pins.push({
      id: `city-${c.id}`,
      name: c.name,
      type: "city",
      coordinates,
      coverImage: c.coverImage,
      description: c.description,
      destinationSlug: c.destinationSlug,
    });
  }

  for (const t of input.trips) {
    const coordinates = normalizeCoordinates(t.coordinates);
    if (!coordinates) continue;
    pins.push({
      id: `trip-${t.id}`,
      name: t.title,
      type: "trip",
      coordinates,
      coverImage: t.coverImage,
      description: t.description,
      visitDate: t.startDate,
      tripSlug: t.slug,
    });
  }

  return pins;
}

/** Manual pins win over auto-generated entries at the same key. */
export function mergeMapLocations(
  manual: MapLocation[],
  derived: MapLocation[]
): MapLocation[] {
  const normalizedManual = manual
    .map(normalizeMapLocation)
    .filter((l): l is MapLocation => l !== null);

  const keys = new Set(
    normalizedManual.map((l) => `${l.type}:${l.destinationSlug ?? l.tripSlug ?? l.storySlug ?? l.id}`)
  );

  const merged = [...normalizedManual];
  for (const d of derived) {
    const key = `${d.type}:${d.destinationSlug ?? d.tripSlug ?? d.storySlug ?? d.id}`;
    if (keys.has(key)) continue;
    keys.add(key);
    merged.push(d);
  }

  return merged;
}
