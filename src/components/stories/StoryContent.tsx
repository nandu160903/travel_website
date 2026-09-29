"use client";

import { motion, useScroll, useSpring } from "motion/react";

export function StoryContent({ html }: { html: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-ocean origin-left z-50"
        style={{ scaleX }}
      />
      <article
        className="prose-editorial px-6 md:px-8 py-12"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
