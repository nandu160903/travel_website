"use client";

import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { motion } from "motion/react";
import type { Video } from "@/types";

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <motion.article
      whileHover="hover"
      initial="rest"
      className="group"
      data-cursor="view"
    >
      <Link href={`/videos#${video.id}`} className="block">
        <div className="relative aspect-video overflow-hidden mb-4 image-editorial">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover editorial-img"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-tone-dark/25 group-hover:bg-tone-dark/15 transition-colors duration-[var(--duration-standard)]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              variants={{
                rest: { scale: 1 },
                hover: { scale: 1.05 },
              }}
              transition={{ duration: 0.2 }}
              className="w-12 h-12 border border-tone-light/90 flex items-center justify-center bg-tone-dark/20"
            >
              <Play size={18} className="text-tone-light ml-0.5" fill="currentColor" />
            </motion.div>
          </div>
          {video.duration && (
            <span className="absolute bottom-3 right-3 font-coords text-tone-light bg-tone-dark/70 px-2 py-1 normal-case tracking-normal">
              {video.duration}
            </span>
          )}
        </div>
        <h3 className="font-display text-xl md:text-2xl uppercase tracking-tight leading-[0.95] group-hover:text-trail transition-colors duration-[var(--duration-micro)]">
          {video.title}
        </h3>
        {video.location && (
          <p className="travel-meta mt-2">{video.location}</p>
        )}
      </Link>
    </motion.article>
  );
}
