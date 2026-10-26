"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import { NORMAD_CHARCOAL, NORMAD_IVORY, NORMAD_LIME } from "./normad-colors";
import {
  NORMAD_N_CHARCOAL,
  NORMAD_N_IVORY,
  NORMAD_PIN,
  NORMAD_ROUTE,
  NORMAD_TOPO_LINES,
} from "./normad-symbol-paths";

export type NormadSymbolVariant = "default" | "favicon" | "monochrome";

export interface NormadSymbolProps {
  className?: string;
  size?: number;
  variant?: NormadSymbolVariant;
  /** One-shot route draw on mount; respects prefers-reduced-motion via CSS */
  animateRoute?: boolean;
  title?: string;
}

export function NormadSymbol({
  className,
  size = 40,
  variant = "default",
  animateRoute = false,
  title = "Normad emblem",
}: NormadSymbolProps) {
  const uid = useId().replace(/:/g, "");
  const clipId = `normad-topo-${uid}`;

  const isMono = variant === "monochrome";
  const isFavicon = variant === "favicon";
  const ivory = isMono ? "currentColor" : NORMAD_IVORY;
  const charcoal = isMono ? "currentColor" : NORMAD_CHARCOAL;
  const lime = isMono ? "currentColor" : NORMAD_LIME;
  const topoLines = isFavicon ? NORMAD_TOPO_LINES.slice(0, 3) : NORMAD_TOPO_LINES;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 overflow-visible", className)}
      role="img"
      aria-label={title}
    >
      <defs>
        <clipPath id={clipId}>
          <path d={NORMAD_N_CHARCOAL} />
        </clipPath>
      </defs>

      <path d={NORMAD_N_CHARCOAL} fill={charcoal} opacity={isMono ? 0.28 : 1} />

      <g clipPath={`url(#${clipId})`} opacity={isMono ? 0.45 : 0.55}>
        {topoLines.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke={ivory}
            strokeWidth={isFavicon ? 0.85 : 0.65}
            strokeLinecap="round"
            fill="none"
          />
        ))}
      </g>

      <path d={NORMAD_N_IVORY} fill={ivory} />

      <path
        d={NORMAD_ROUTE}
        stroke={lime}
        strokeWidth={isFavicon ? 3.4 : 2.85}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        className={animateRoute ? "normad-route-draw" : undefined}
        pathLength={100}
      />

      <path d={NORMAD_PIN.drop} fill={lime} />
      <circle
        cx={NORMAD_PIN.dot.cx}
        cy={NORMAD_PIN.dot.cy}
        r={NORMAD_PIN.dot.r}
        fill={isMono ? "var(--background, #0a0a0a)" : NORMAD_CHARCOAL}
      />
    </svg>
  );
}
