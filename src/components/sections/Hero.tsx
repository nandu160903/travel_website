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
  title = "CHASING\nHORIZONS.",
  subtitle = "Stories, photographs and memories\nfrom everywhere the road takes me.",
}: HeroProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -40]);

  return (
    <section ref={ref} className="relative h-screen min-h-[600px] overflow-hidden">
      <motion.div
        style={{ scale: imageScale, y: imageY }}
        className="absolute inset-0"
      >
        <Image
          src={heroImage}
          alt="Travel hero"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 via-charcoal/20 to-background" />

      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-10 h-full flex flex-col justify-end pb-24 md:pb-32 px-6 md:px-8 max-w-7xl mx-auto"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-[10px] uppercase tracking-[0.4em] text-white/60 mb-6"
        >
          Personal Travel Journal
        </motion.p>

        <AnimatedText
          text={title}
          className="font-display text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-white leading-[0.9] tracking-tight max-w-4xl"
          delay={0.3}
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-white/70 text-base md:text-lg mt-6 max-w-md leading-relaxed whitespace-pre-line"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-wrap gap-4 mt-10"
        >
          <Link href="/journeys">
            <Button variant="primary">Explore My Journeys</Button>
          </Link>
          <Link href="/map">
            <Button variant="outline" className="border-white/30 text-white hover:border-white hover:text-white">
              View The Map
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-white/50"
        >
          <ChevronDown size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
}
