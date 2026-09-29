import { TravelMap } from "@/components/map/TravelMap";
import { MapLocationManager } from "@/components/studio/MapLocationManager";
import { getStudioMapLocations } from "@/lib/data/studio-queries";

export default async function StudioMapPage() {
  const locations = await getStudioMapLocations();

  return (
    <div className="p-8 md:p-10 max-w-6xl space-y-10">
      <div>
        <h1 className="font-display text-3xl mb-2">Map Locations</h1>
        <p className="text-muted text-sm">Manage pins shown on the public travel map.</p>
      </div>
      <TravelMap locations={locations} height="45vh" />
      <MapLocationManager key={locations.map((l) => l.id).join("-")} locations={locations} />
    </div>
  );
}
