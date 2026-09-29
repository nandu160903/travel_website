"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { Story } from "@/types";
import { storyCategories } from "@/lib/config";

interface StoryCardProps {
  story: Story;
  size?: "default" | "large";
}

export function StoryCard({ story, size = "default" }: StoryCardProps) {
  const categoryLabel =
    storyCategories.find((c) => c.slug === story.category)?.label ?? story.category;

  return (
    <motion.article
      whileHover="hover"
      initial="rest"
      data-cursor="read"
      className="group"
    >
      <Link href={`/stories/${story.slug}`} className="block">
        <div className="relative overflow-hidden mb-5 aspect-[4/5] md:aspect-[3/4]">
          <motion.div
            variants={{
              rest: { scale: 1 },
              hover: { scale: 1.06 },
            }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={story.coverImage}
              alt={story.title}
              fill
              className="object-cover"
              sizes={size === "large" ? "50vw" : "33vw"}
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Badge variant="muted">
              {story.cityName ? `${story.cityName.toUpperCase()} · ` : ""}
              {story.destinationName.toUpperCase()}
            </Badge>
            <span className="text-[10px] text-muted uppercase tracking-widest">
              {story.readingTime} min read
            </span>
          </div>

          <motion.h3
            variants={{
              rest: { x: 0 },
              hover: { x: 4 },
            }}
            className={`font-display leading-tight group-hover:text-ocean transition-colors ${
              size === "large" ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"
            }`}
          >
            {story.title}
          </motion.h3>

          <p className="text-muted text-sm line-clamp-2 leading-relaxed">
            {story.excerpt}
          </p>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[10px] uppercase tracking-widest text-muted">
              {formatDate(story.publishedAt)} · {categoryLabel}
            </span>
            <ArrowUpRight
              size={16}
              className="text-muted group-hover:text-ocean group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
            />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
