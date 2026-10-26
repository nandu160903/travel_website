"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useCallback } from "react";
import type { Photo } from "@/types";

interface LightboxProps {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ photos, currentIndex, onClose, onNavigate }: LightboxProps) {
  const photo = photos[currentIndex];

  const goNext = useCallback(() => {
    onNavigate((currentIndex + 1) % photos.length);
  }, [currentIndex, photos.length, onNavigate]);

  const goPrev = useCallback(() => {
    onNavigate((currentIndex - 1 + photos.length) % photos.length);
  }, [currentIndex, photos.length, onNavigate]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose, goNext, goPrev]);

  if (!photo) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-tone-dark/95 flex flex-col"
      >
        <div className="flex items-center justify-between p-4 md:p-6 safe-top safe-x">
          <div className="text-tone-light/70 text-xs uppercase tracking-widest">
            {currentIndex + 1} / {photos.length}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="touch-target inline-flex items-center justify-center text-tone-light/70 hover:text-tone-light transition-colors"
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 relative flex items-center justify-center px-4 md:px-16">
          <button
            type="button"
            onClick={goPrev}
            className="touch-target absolute left-2 md:left-8 z-10 inline-flex items-center justify-center text-tone-light/50 hover:text-tone-light transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeft size={32} />
          </button>

          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="relative w-full max-w-5xl aspect-[4/3] max-h-[min(62dvh,520px)] md:max-h-none md:aspect-auto md:h-[70vh]"
          >
            <Image
              src={photo.url}
              alt={photo.caption ?? "Photo"}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </motion.div>

          <button
            type="button"
            onClick={goNext}
            className="touch-target absolute right-2 md:right-8 z-10 inline-flex items-center justify-center text-tone-light/50 hover:text-tone-light transition-colors"
            aria-label="Next photo"
          >
            <ChevronRight size={32} />
          </button>
        </div>

        <div className="p-4 md:p-6 text-center text-tone-light/80">
          {photo.caption && <p className="text-sm mb-1">{photo.caption}</p>}
          <div className="flex items-center justify-center gap-4 text-[10px] uppercase tracking-widest text-tone-light/50">
            {photo.location && <span>{photo.location}</span>}
            {photo.takenAt && <span>{photo.takenAt}</span>}
            {photo.camera && <span>{photo.camera}</span>}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
