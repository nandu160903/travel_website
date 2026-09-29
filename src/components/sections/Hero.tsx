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

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.45], [0, -40]);

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden">
      <motion.div style={{ scale: imageScale, y: imageY }} className="absolute inset-0">
        <Image
          src={heroImage}
          alt="Travel hero"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, var(--hero-overlay-from), var(--hero-overlay-mid), var(--background))`,
        }}
      />

      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-10 flex min-h-[100svh] flex-col justify-end px-6 md:px-10 pb-28 md:pb-36 pt-24 max-w-7xl mx-auto w-full gap-5 md:gap-6"
      >
        <AnimatedText
          text={title}
          className="font-display text-[2.75rem] sm:text-5xl md:text-6xl lg:text-7xl text-tone-light max-w-4xl font-bold"
          delay={0.35}
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-tone-light/80 text-base md:text-lg max-w-lg leading-relaxed font-sans"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.8 }}
          className="flex flex-wrap gap-3 md:gap-4"
        >
          <Link href="/journeys">
            <Button variant="primary">Explore Journeys</Button>
          </Link>
          <Link href="/map">
            <Button
              variant="outline"
              className="border-tone-light/35 text-tone-light hover:border-tone-light hover:text-tone-light hover:bg-tone-light/10"
            >
              View The Map
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          className="text-tone-light/45"
        >
          <ChevronDown size={22} />
        </motion.div>
      </motion.div>
    </section>
  );
}
