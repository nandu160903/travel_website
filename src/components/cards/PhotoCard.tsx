"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { Photo } from "@/types";

interface PhotoCardProps {
  photo: Photo;
  onClick?: () => void;
  index?: number;
}

export function PhotoCard({ photo, onClick, index = 0 }: PhotoCardProps) {
  const aspectRatio =
    photo.width && photo.height
      ? photo.height > photo.width
        ? "aspect-[3/4]"
        : "aspect-[4/3]"
      : "aspect-[4/5]";

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      data-cursor="view"
      className={`group relative w-full overflow-hidden image-editorial ${aspectRatio} block text-left`}
    >
      <Image
        src={photo.url}
        alt={photo.caption ?? "Travel photo"}
        fill
        className="object-cover editorial-img"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <div className="absolute inset-0 bg-tone-dark/0 group-hover:bg-tone-dark/25 hover-reveal-overlay transition-colors duration-[var(--duration-standard)]" />
      {photo.location && (
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hover-reveal-meta transition-all duration-[var(--duration-standard)] bg-gradient-to-t from-tone-dark/85 to-transparent">
          <p className="travel-meta text-tone-light/85">{photo.location}</p>
          {photo.takenAt && (
            <p className="font-coords text-tone-light/45 mt-1 normal-case tracking-normal">
              {photo.takenAt}
            </p>
          )}
        </div>
      )}
    </motion.button>
  );
}
