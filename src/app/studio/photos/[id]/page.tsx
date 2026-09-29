import { notFound } from "next/navigation";
import { PhotoEditor } from "@/components/studio/PhotoEditor";
import { getStudioPhoto } from "@/lib/data/studio-queries";

interface EditPhotoPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPhotoPage({ params }: EditPhotoPageProps) {
  const { id } = await params;
  const photo = await getStudioPhoto(id);
  if (!photo) notFound();

  return (
    <div className="p-8 md:p-10 max-w-3xl">
      <h1 className="font-display text-3xl mb-8">Edit Photo</h1>
      <PhotoEditor initial={photo} />
    </div>
  );
}
