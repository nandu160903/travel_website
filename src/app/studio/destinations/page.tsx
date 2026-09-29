import Link from "next/link";
import { getStudioDestinations } from "@/lib/data/studio-queries";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default async function StudioDestinationsPage() {
  const destinations = await getStudioDestinations();

  return (
    <div className="p-8 md:p-10 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl">Destinations</h1>
          <p className="text-muted text-sm mt-1">{destinations.length} destinations</p>
        </div>
        <Link href="/studio/destinations/new">
          <Button size="sm">Add Destination</Button>
        </Link>
      </div>

      <div className="space-y-2">
        {destinations.map((dest) => (
          <Link
            key={dest.id}
            href={`/studio/destinations/${dest.slug}`}
            className="flex items-center justify-between p-4 border border-border hover:border-ocean transition-colors"
          >
            <div>
              <p className="font-medium">{dest.name}</p>
              <p className="text-xs text-muted mt-1">{dest.country}</p>
            </div>
            <div className="flex gap-2">
              {dest.featured && <Badge variant="accent">Featured</Badge>}
              <Badge variant="muted">{dest.status}</Badge>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
