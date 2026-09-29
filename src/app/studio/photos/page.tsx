import { getPhotos } from "@/lib/data/queries";

export default async function StudioPhotosPage() {
  const photos = await getPhotos();

  return (
    <div className="p-8 md:p-10 max-w-6xl">
      <h1 className="font-display text-3xl mb-8">Photos</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {photos.map((photo) => (
          <div key={photo.id} className="aspect-square bg-muted-bg overflow-hidden group relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.url} alt={photo.caption ?? ""} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-tone-dark/0 group-hover:bg-tone-dark/40 transition-colors flex items-end p-2 opacity-0 group-hover:opacity-100">
              <p className="text-tone-light text-[10px] truncate">{photo.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
