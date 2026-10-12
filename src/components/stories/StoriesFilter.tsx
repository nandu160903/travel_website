"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { storyCategories } from "@/lib/config";
import { cn } from "@/lib/utils";

interface StoriesFilterProps {
  activeCategory?: string;
}

export function StoriesFilter({ activeCategory }: StoriesFilterProps) {
  const filters = [{ slug: undefined, label: "All" }, ...storyCategories];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((cat) => {
        const isActive =
          (!activeCategory && !cat.slug) || activeCategory === cat.slug;
        const href = cat.slug ? `/stories?category=${cat.slug}` : "/stories";

        return (
          <Link key={cat.label} href={href} className="relative">
            {isActive && (
              <motion.div
                layoutId="story-filter"
                className="absolute inset-0 bg-trail"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
            <span
              className={cn(
                "relative block px-4 py-2 travel-meta transition-colors border border-border",
                isActive
                  ? "text-paper border-transparent"
                  : "text-muted hover:text-foreground hover:border-trail/35"
              )}
            >
              {cat.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
