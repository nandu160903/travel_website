"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

const SLIDE_INTERVAL_MS = 7000;

const defaultSlides = [
  {
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=2400&q=85",
    title: "NORMAD",
    subtitle: "Motorcycle miles across India — passes, ghats, and open highway.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2400&q=85",
    title: "HIGH PASSES",
    subtitle: "Thin air, slow lines, and the relief of a warm cup at the top.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=2400&q=85",
    title: "OPEN ROAD",
    subtitle: "Wrong turns that become the best stories — logged here as they happened.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=2400&q=85",
    title: "TWO WHEELS",
    subtitle: "Where cell service fades and the ride is the whole point.",
  },
];

interface HeroProps {
  heroImage: string;
  title?: string;
  subtitle?: string;
}

export function Hero({ heroImage, title, subtitle }: HeroProps) {
  const slides = [
    {
      ...defaultSlides[0],
      image: heroImage || defaultSlides[0].image,
      title: title ?? defaultSlides[0].title,
      subtitle: subtitle ?? defaultSlides[0].subtitle,
    },
    ...defaultSlides.slice(1),
  ];

  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const slide = slides[active];

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-tone-dark">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.image}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 45%, rgba(10,10,10,0.92) 100%)",
        }}
      />

      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 pt-24 pb-28 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.title}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-5xl"
          >
            <h1 className="font-display text-[clamp(2.125rem,10vw,3.25rem)] sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold uppercase tracking-tight text-tone-light leading-[0.92] break-words">
              {slide.title}
            </h1>
            <p className="mt-5 text-tone-light/75 text-sm md:text-base max-w-lg mx-auto leading-relaxed font-sans">
              {slide.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
