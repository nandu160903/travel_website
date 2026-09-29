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
        <div className="relative aspect-video overflow-hidden mb-4">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-tone-dark/30 group-hover:bg-tone-dark/20 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              variants={{
                rest: { scale: 1 },
                hover: { scale: 1.1 },
              }}
              className="w-14 h-14 rounded-full border border-tone-light/80 flex items-center justify-center"
            >
              <Play size={20} className="text-tone-light ml-1" fill="currentColor" />
            </motion.div>
          </div>
          {video.duration && (
            <span className="absolute bottom-3 right-3 text-[10px] uppercase tracking-widest text-tone-light bg-tone-dark/60 px-2 py-1">
              {video.duration}
            </span>
          )}
        </div>
        <h3 className="font-display text-2xl group-hover:text-ocean transition-colors">
          {video.title}
        </h3>
        {video.location && (
          <p className="text-[10px] uppercase tracking-widest text-muted mt-1">
            {video.location}
          </p>
        )}
      </Link>
    </motion.article>
  );
}
