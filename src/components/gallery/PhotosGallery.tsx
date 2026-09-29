"use client";

import { useState } from "react";
import { PhotoCard } from "@/components/cards/PhotoCard";
import { Lightbox } from "./Lightbox";
import type { Photo } from "@/types";

interface PhotosGalleryProps {
  photos: Photo[];
}

export function PhotosGallery({ photos }: PhotosGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (photos.length === 0) {
    return (
      <p className="text-center text-muted py-20">No photos yet.</p>
    );
  }

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4" data-cursor="drag">
        {photos.map((photo, i) => (
          <div key={photo.id} className="break-inside-avoid">
            <PhotoCard photo={photo} index={i} onClick={() => setLightboxIndex(i)} />
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
