import Link from "next/link";
import { getStudioPhotos } from "@/lib/data/studio-queries";
import { Button } from "@/components/ui/Button";

export default async function StudioPhotosPage() {
  const photos = await getStudioPhotos();

  return (
    <div className="p-8 md:p-10 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Photos</h1>
        <Link href="/studio/photos/new">
          <Button size="sm">Add Photo</Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {photos.map((photo) => (
          <Link
            key={photo.id}
            href={`/studio/photos/${photo.id}`}
            className="aspect-square bg-muted-bg overflow-hidden group relative border border-border hover:border-ocean transition-colors"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.url} alt={photo.caption ?? ""} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-tone-dark/0 group-hover:bg-tone-dark/40 transition-colors flex items-end p-2 opacity-0 group-hover:opacity-100">
              <p className="text-tone-light text-[10px] truncate">{photo.location ?? photo.caption}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
