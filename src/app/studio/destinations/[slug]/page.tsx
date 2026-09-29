import { notFound } from "next/navigation";
import { DestinationEditor } from "@/components/studio/DestinationEditor";
import { getStudioDestination } from "@/lib/data/studio-queries";

interface EditDestinationPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditDestinationPage({ params }: EditDestinationPageProps) {
  const { slug } = await params;
  const destination = await getStudioDestination(slug);
  if (!destination) notFound();

  return (
    <div className="p-8 md:p-10 max-w-3xl">
      <h1 className="font-display text-3xl mb-8">Edit Destination</h1>
      <DestinationEditor initial={destination} />
    </div>
  );
}
