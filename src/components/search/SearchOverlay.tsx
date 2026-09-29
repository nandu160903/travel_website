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

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-background/95 backdrop-blur-md"
        >
          <div className="max-w-2xl mx-auto px-6 pt-24">
            <div className="flex items-center gap-4 border-b border-border pb-4">
              <Search size={20} className="text-muted shrink-0" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search stories, destinations, journeys..."
                className="flex-1 bg-transparent text-xl text-foreground placeholder:text-muted focus:outline-none font-display"
              />
              <button
                onClick={onClose}
                className="text-muted hover:text-foreground transition-colors"
                aria-label="Close search"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 space-y-2">
              {loading && (
                <p className="text-muted text-sm">Searching...</p>
              )}
              {!loading && query && results.length === 0 && (
                <p className="text-muted text-sm">No results found.</p>
              )}
              {results.map((result, i) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={result.url}
                    onClick={onClose}
                    className="flex items-center gap-4 p-3 hover:bg-muted-bg transition-colors group"
                  >
                    {result.image && (
                      <div className="relative w-12 h-12 shrink-0 overflow-hidden">
                        <Image
                          src={result.image}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{result.title}</p>
                      {result.subtitle && (
                        <p className="text-sm text-muted truncate">{result.subtitle}</p>
                      )}
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-muted group-hover:text-ocean group-hover:translate-x-1 transition-all shrink-0"
                    />
                  </Link>
                </motion.div>
              ))}
            </div>

            <p className="mt-8 text-xs text-muted text-center">
              Press <kbd className="px-1.5 py-0.5 border border-border rounded text-[10px]">/</kbd> to search · <kbd className="px-1.5 py-0.5 border border-border rounded text-[10px]">Esc</kbd> to close
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
