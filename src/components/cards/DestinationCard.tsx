"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { Destination } from "@/types";
import { cn } from "@/lib/utils";

interface DestinationCardProps {
  destination: Destination;
  size?: "small" | "medium" | "large";
  className?: string;
}

export function DestinationCard({
  destination,
  size = "medium",
  className,
}: DestinationCardProps) {
  const sizeClasses = {
    small: "aspect-[3/4] min-h-[280px]",
    medium: "aspect-[4/5] min-h-[360px]",
    large: "aspect-[16/10] min-h-[480px] md:min-h-[560px]",
  };

  return (
    <motion.article
      whileHover="hover"
      initial="rest"
      data-cursor="view"
      className={cn("group relative overflow-hidden", sizeClasses[size], className)}
    >
      <Link href={`/destinations/${destination.slug}`} className="block absolute inset-0">
        <motion.div
          variants={{
            rest: { scale: 1 },
            hover: { scale: 1.08 },
          }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={destination.coverImage}
            alt={destination.name}
            fill
            className="object-cover"
            sizes={size === "large" ? "70vw" : "40vw"}
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/60 mb-2">
            {destination.region ?? destination.country}
          </p>
          <motion.h3
            variants={{
              rest: { y: 0 },
              hover: { y: -4 },
            }}
            className={cn(
              "font-display text-white leading-none",
              size === "large" ? "text-5xl md:text-7xl" : size === "medium" ? "text-4xl md:text-5xl" : "text-3xl"
            )}
          >
            {destination.name}
          </motion.h3>
          <motion.p
            variants={{
              rest: { opacity: 0, y: 8 },
              hover: { opacity: 1, y: 0 },
            }}
            className="text-white/70 text-sm mt-3 line-clamp-2"
          >
            {destination.storyCount} stories · {destination.photoCount} photos
          </motion.p>
        </div>
      </Link>
    </motion.article>
  );
}
