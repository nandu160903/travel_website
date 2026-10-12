"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { AnimatedText } from "@/components/animation/AnimatedText";
import { Button } from "@/components/ui/Button";
import { ChevronDown } from "lucide-react";

interface HeroProps {
  heroImage: string;
  title?: string;
  subtitle?: string;
}

export function Hero({
  heroImage,
  title = "The Road\nKeeps Calling",
  subtitle = "Stories, places and memories collected along the way.",
}: HeroProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.06, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.45], [0, -32]);

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden">
      <motion.div style={{ scale: imageScale, y: imageY }} className="absolute inset-0">
        <Image
          src={heroImage}
          alt="Travel hero"
          fill
          priority
          className="object-cover editorial-img"
          sizes="100vw"
        />
      </motion.div>

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, var(--hero-overlay-from) 0%, var(--hero-overlay-mid) 45%, var(--background) 100%)`,
        }}
      />

      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-10 flex min-h-[100svh] flex-col justify-end px-6 md:px-10 pb-28 md:pb-36 pt-24 max-w-7xl mx-auto w-full gap-6 md:gap-7"
      >
        <AnimatedText
          text={title}
          className="font-display text-[2.65rem] sm:text-5xl md:text-[3.75rem] lg:text-[4.5rem] text-tone-light max-w-4xl font-bold uppercase"
          delay={0.35}
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-tone-light/75 text-base md:text-lg max-w-md leading-relaxed font-sans font-medium"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap gap-3 md:gap-4 pt-2"
        >
          <Link href="/journeys">
            <Button variant="primary">Explore Journeys</Button>
          </Link>
          <Link href="/map">
            <Button
              variant="outline"
              className="border-tone-light/40 text-tone-light hover:border-trail hover:text-trail hover:bg-transparent"
            >
              View The Map
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
          className="text-tone-light/35"
        >
          <ChevronDown size={20} strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}
