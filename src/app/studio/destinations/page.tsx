import { getDestinations } from "@/lib/data/queries";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default async function StudioDestinationsPage() {
  const destinations = await getDestinations();

  return (
    <div className="p-8 md:p-10 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl">Destinations</h1>
          <p className="text-muted text-sm mt-1">{destinations.length} destinations</p>
        </div>
        <Button size="sm">Add Destination</Button>
      </div>

      <div className="space-y-2">
        {destinations.map((dest) => (
          <div key={dest.id} className="flex items-center justify-between p-4 border border-border">
            <div>
              <p className="font-medium">{dest.name}</p>
              <p className="text-xs text-muted mt-1">{dest.country} · {dest.storyCount} stories</p>
            </div>
            <div className="flex gap-2">
              {dest.featured && <Badge variant="accent">Featured</Badge>}
              <Badge variant="muted">{dest.status}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
