"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  splitBy?: "word" | "line";
}

export function AnimatedText({
  text,
  className,
  as: Tag = "h1",
  delay = 0,
  splitBy = "line",
}: AnimatedTextProps) {
  const parts =
    splitBy === "line"
      ? text.split("\n")
      : text.split(" ");

  return (
    <Tag className={cn("overflow-hidden", className)}>
      {parts.map((part, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: delay + i * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {part}
            {splitBy === "word" && i < parts.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
