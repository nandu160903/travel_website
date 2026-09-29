import { promises as fs } from "fs";
import path from "path";
import type { CmsStore } from "./types";

const STORE_PATH = path.join(process.cwd(), "data", "cms-store.json");

export function emptyCmsStore(): CmsStore {
  return {
    destinations: [],
    trips: [],
    stories: [],
    photos: [],
    videos: [],
    mapLocations: [],
  };
}

export async function readCmsStore(): Promise<CmsStore | null> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    return JSON.parse(raw) as CmsStore;
  } catch {
    return null;
  }
}

export async function writeCmsStore(store: CmsStore): Promise<void> {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
}

export function cmsStoreHasContent(store: CmsStore): boolean {
  return !!(
    store.siteSettings ||
    store.destinations.length ||
    store.trips.length ||
    store.stories.length ||
    store.photos.length ||
    store.videos.length ||
    store.mapLocations.length
  );
}

export async function updateCmsStore(
  updater: (store: CmsStore) => CmsStore
): Promise<CmsStore> {
  const current = (await readCmsStore()) ?? emptyCmsStore();
  const next = updater(structuredClone(current));
  await writeCmsStore(next);
  return next;
}
