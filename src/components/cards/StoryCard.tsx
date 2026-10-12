"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
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
      transition={{ duration: 0.32 }}
      data-cursor="read"
      className="group"
    >
      <Link href={`/stories/${story.slug}`} className="block">
        <div className="relative overflow-hidden mb-5 aspect-[4/5] md:aspect-[3/4] image-editorial">
          <Image
            src={story.coverImage}
            alt={story.title}
            fill
            className="object-cover editorial-img"
            sizes={size === "large" ? "50vw" : "33vw"}
          />
        </div>

        <div className="space-y-2 border-l border-transparent group-hover:border-trail pl-0 group-hover:pl-4 transition-all duration-[var(--duration-standard)] ease-[var(--ease-out-editorial)]">
          <p className="travel-meta">
            {story.cityName ? `${story.cityName.toUpperCase()} · ` : ""}
            {story.destinationName.toUpperCase()}
          </p>

          <h3
            className={`font-display font-bold leading-[0.95] uppercase tracking-tight group-hover:text-trail transition-colors duration-[var(--duration-micro)] break-words ${
              size === "large" ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
            }`}
          >
            {story.title}
          </h3>

          <p className="text-muted text-sm line-clamp-2 leading-relaxed font-medium">{story.excerpt}</p>

          <div className="flex items-center justify-between pt-2">
            <span className="font-coords">
              {formatDate(story.publishedAt)} · {story.readingTime} min · {categoryLabel}
            </span>
            <ArrowUpRight
              size={16}
              strokeWidth={1.5}
              className="text-muted group-hover:text-trail group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-[var(--duration-micro)]"
            />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
