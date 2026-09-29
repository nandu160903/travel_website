import { notFound } from "next/navigation";
import { TripEditor } from "@/components/studio/TripEditor";
import { getStudioTrip } from "@/lib/data/studio-queries";

interface EditTripPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditTripPage({ params }: EditTripPageProps) {
  const { slug } = await params;
  const trip = await getStudioTrip(slug);
  if (!trip) notFound();

  return (
    <div className="p-8 md:p-10 max-w-3xl">
      <h1 className="font-display text-3xl mb-8">Edit Journey</h1>
      <TripEditor initial={trip} />
    </div>
  );
}
