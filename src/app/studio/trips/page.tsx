import Link from "next/link";
import { getTrips } from "@/lib/data/queries";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default async function StudioTripsPage() {
  const trips = await getTrips();

  return (
    <div className="p-8 md:p-10 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl">Journeys</h1>
          <p className="text-muted text-sm mt-1">Manage your trips and journeys</p>
        </div>
        <Link href="/studio/trips/new">
          <Button size="sm">New Trip</Button>
        </Link>
      </div>

      <div className="space-y-2">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="flex items-center justify-between p-4 border border-border"
          >
            <div>
              <p className="font-medium">{trip.title}</p>
              <p className="text-xs text-muted mt-1">
                {trip.country} · {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
              </p>
            </div>
            <Badge variant={trip.status === "published" ? "accent" : "muted"}>
              {trip.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
