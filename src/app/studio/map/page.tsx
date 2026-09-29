import { TravelMap } from "@/components/map/TravelMap";
import { getMapLocations } from "@/lib/data/queries";

export default async function StudioMapPage() {
  const locations = await getMapLocations();

  return (
    <div className="p-8 md:p-10">
      <h1 className="font-display text-3xl mb-6">Map Locations</h1>
      <TravelMap locations={locations} height="60vh" />
    </div>
  );
}
