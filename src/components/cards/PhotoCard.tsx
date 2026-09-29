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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      data-cursor="view"
      className={`group relative w-full overflow-hidden ${aspectRatio} block text-left`}
    >
      <Image
        src={photo.url}
        alt={photo.caption ?? "Travel photo"}
        fill
        className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <div className="absolute inset-0 bg-tone-dark/0 group-hover:bg-tone-dark/35 transition-colors duration-500" />
      {photo.location && (
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-tone-dark/80 to-transparent">
          <p className="travel-meta text-tone-light/80">{photo.location}</p>
          {photo.takenAt && <p className="text-[10px] text-tone-light/50 mt-1">{photo.takenAt}</p>}
        </div>
      )}
    </motion.button>
  );
}
