"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { motion } from "motion/react";

interface VideoPlayerProps {
  embedUrl: string;
  title: string;
  thumbnail: string;
}

export function VideoPlayer({ embedUrl, title, thumbnail }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="relative aspect-video overflow-hidden">
        <iframe
          src={`${embedUrl}?autoplay=1&mute=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      className="relative aspect-video w-full overflow-hidden group"
      data-cursor="view"
      aria-label={`Play ${title}`}
    >
      <Image
        src={thumbnail}
        alt={title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-700"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-charcoal/30 group-hover:bg-charcoal/20 transition-colors" />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center"
        >
          <Play size={28} className="text-white ml-1" fill="white" />
        </motion.div>
      </div>
      <p className="absolute bottom-6 left-6 font-display text-3xl text-white">{title}</p>
    </button>
  );
}
