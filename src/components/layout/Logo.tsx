"use client";

import Link from "next/link";
import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  siteTitle?: string;
  className?: string;
  onSecretActivate?: () => void;
  light?: boolean;
  monogram?: boolean;
}

export function Logo({
  siteTitle = "Horizon",
  className,
  onSecretActivate,
  light,
  monogram = false,
}: LogoProps) {
  const clickTimestamps = useRef<number[]>([]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!onSecretActivate) return;

      const now = Date.now();
      clickTimestamps.current = clickTimestamps.current.filter((t) => now - t < 2000);
      clickTimestamps.current.push(now);

      if (clickTimestamps.current.length >= 5) {
        e.preventDefault();
        clickTimestamps.current = [];
        onSecretActivate();
      }
    },
    [onSecretActivate]
  );

  const letter = siteTitle.trim().charAt(0).toUpperCase() || "S";

  return (
    <Link
      href="/"
      onClick={handleClick}
      className={cn(
        "select-none transition-colors duration-[var(--duration-micro)] shrink-0",
        monogram
          ? cn(
              "font-display text-xl md:text-2xl font-bold italic tracking-tight",
              light ? "text-tone-light hover:text-olive" : "text-foreground hover:text-olive"
            )
          : cn(
              "font-display text-lg md:text-xl font-bold tracking-tight uppercase",
              light ? "text-tone-light hover:text-olive" : "text-foreground hover:text-olive"
            ),
        className
      )}
    >
      {monogram ? letter : siteTitle}
    </Link>
  );
}
