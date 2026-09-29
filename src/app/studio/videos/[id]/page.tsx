import { notFound } from "next/navigation";
import { VideoEditor } from "@/components/studio/VideoEditor";
import { getStudioVideo } from "@/lib/data/studio-queries";

interface EditVideoPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditVideoPage({ params }: EditVideoPageProps) {
  const { id } = await params;
  const video = await getStudioVideo(id);
  if (!video) notFound();

  return (
    <div className="p-8 md:p-10 max-w-3xl">
      <h1 className="font-display text-3xl mb-8">Edit Video</h1>
      <VideoEditor initial={video} />
    </div>
  );
}
