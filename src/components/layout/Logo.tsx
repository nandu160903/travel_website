"use client";

import Link from "next/link";
import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  siteTitle?: string;
  className?: string;
  onSecretActivate?: () => void;
  light?: boolean;
}

export function Logo({ siteTitle = "Horizon", className, onSecretActivate, light }: LogoProps) {
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

  return (
    <Link
      href="/"
      onClick={handleClick}
      className={cn(
        "font-display text-lg md:text-xl font-bold tracking-tight uppercase select-none transition-colors duration-[var(--duration-micro)]",
        light ? "text-tone-light hover:text-trail" : "text-foreground hover:text-trail",
        className
      )}
    >
      {siteTitle}
    </Link>
  );
}
