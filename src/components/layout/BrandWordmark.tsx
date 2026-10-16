"use client";

import { cn } from "@/lib/utils";

interface BrandWordmarkProps {
  name: string;
  tagline: string;
  light?: boolean;
}

function splitDisplayName(name: string) {
  const trimmed = name.trim();
  if (trimmed.length <= 3) {
    return { lead: trimmed, tail: "" };
  }
  return { lead: trimmed.slice(0, -3), tail: trimmed.slice(-3) };
}

/** Chamfered N monogram + Syne split wordmark; "oo" in wheels rendered as tire pair. */
export function BrandWordmark({ name, tagline, light }: BrandWordmarkProps) {
  const { lead, tail } = splitDisplayName(name);
  const wheelsWord = tagline.replace(/^on\s+/i, "").trim();
  const showWheelPair = /wheels/i.test(wheelsWord);

  return (
    <span
      className={cn("brand-lockup inline-flex items-center gap-2.5 sm:gap-3")}
      data-light={light ? "true" : "false"}
    >
      <span className="brand-glyph shrink-0" aria-hidden>
        <svg
          width="22"
          height="22"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          {/* Mechanical N — chamfered strokes (Terra-style line language) */}
          <path
            d="M6 22V7l8 10 8-10v15"
            className="brand-glyph-stroke"
            strokeWidth="2.15"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          {/* Handlebar accent on the N crossbar */}
          <path
            d="M9.5 15.5h9"
            className="brand-glyph-accent"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {/* Dual-wheel hint at the base */}
          <circle cx="10" cy="22.5" r="1.35" fill="var(--olive)" opacity="0.95" />
          <circle cx="18" cy="22.5" r="1.35" fill="var(--olive)" opacity="0.95" />
        </svg>
      </span>

      <span className="min-w-0 flex flex-col justify-center">
        <span className="brand-name">
          {lead}
          {tail ? <span className="brand-name-tail">{tail}</span> : null}
        </span>

        <span className="brand-tagline">
          <span>on</span>
          <span className="brand-tagline-dot" aria-hidden />
          {showWheelPair ? (
            <span>
              two wh
              <span className="brand-wheel-pair" aria-label="wheels">
                <span />
                <span />
              </span>
              ls
            </span>
          ) : (
            <span>{wheelsWord}</span>
          )}
        </span>
      </span>
    </span>
  );
}
