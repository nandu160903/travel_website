"use client";

import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "motion/react";
import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "glass";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-fg)] hover:bg-[var(--btn-primary-hover)] border border-[var(--btn-primary-bg)] hover:border-[var(--btn-primary-hover)]",
  secondary:
    "bg-sunset text-tone-light hover:opacity-90 border border-sunset",
  ghost:
    "bg-transparent text-foreground hover:bg-muted-bg border border-transparent",
  outline:
    "bg-transparent text-foreground border border-border hover:border-accent hover:text-accent",
  glass:
    "bg-card/80 backdrop-blur-md text-foreground border border-border hover:bg-surface-elevated",
};

const sizes: Record<Size, string> = {
  sm: "px-5 py-2.5 text-[10px] tracking-[0.2em]",
  md: "px-7 py-3.5 text-[11px] tracking-[0.22em]",
  lg: "px-9 py-4 text-xs tracking-[0.24em]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => (
    <motion.button
      ref={ref}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold uppercase transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
);

Button.displayName = "Button";
