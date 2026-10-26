"use client";

import { AnimatePresence, motion } from "motion/react";
import { Search, X, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { SearchResult } from "@/types";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 200);
    return () => clearTimeout(timer);
  }, [query, search]);

  const handleClose = useCallback(() => {
    setQuery("");
    setResults([]);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, handleClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          className="fixed inset-0 z-[90] bg-background/97 safe-x overflow-y-auto"
        >
          <div className="mx-auto max-w-2xl px-6 pt-24 safe-top pb-8">
            <p className="travel-meta travel-meta-accent mb-4">Search the archive</p>
            <div className="flex items-center gap-4 border-b border-border pb-4">
              <Search size={20} strokeWidth={1.5} className="text-muted shrink-0" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Stories, destinations, journeys..."
                className="flex-1 bg-transparent text-xl text-foreground placeholder:text-muted focus:outline-none font-display font-semibold tracking-tight"
              />
              <button
                type="button"
                onClick={handleClose}
                className="text-muted hover:text-trail transition-colors duration-[var(--duration-micro)]"
                aria-label="Close search"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div className="mt-6 space-y-1">
              {loading && <p className="font-coords text-muted">Searching...</p>}
              {!loading && query && results.length === 0 && (
                <p className="font-coords text-muted">No results found.</p>
              )}
              {results.map((result, i) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.28 }}
                >
                  <Link
                    href={result.url}
                    onClick={handleClose}
                    className="flex items-center gap-4 p-3 border border-transparent hover:border-border hover:bg-muted-bg/50 transition-colors duration-[var(--duration-micro)] group"
                  >
                    {result.image && (
                      <div className="relative w-14 h-14 shrink-0 overflow-hidden">
                        <Image
                          src={result.image}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{result.title}</p>
                      {result.subtitle && (
                        <p className="text-sm text-muted truncate font-coords normal-case tracking-normal">
                          {result.subtitle}
                        </p>
                      )}
                    </div>
                    <ArrowRight
                      size={16}
                      strokeWidth={1.5}
                      className="text-muted group-hover:text-trail group-hover:translate-x-1 transition-all shrink-0"
                    />
                  </Link>
                </motion.div>
              ))}
            </div>

            <p className="mt-10 font-coords text-muted text-center normal-case tracking-normal">
              Press <kbd className="px-1.5 py-0.5 border border-border text-[10px]">/</kbd> to search ·{" "}
              <kbd className="px-1.5 py-0.5 border border-border text-[10px]">Esc</kbd> to close
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
