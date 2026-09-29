"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { SocialIcons } from "./SocialIcons";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { CreatorAuthModal } from "@/components/creator/CreatorAuthModal";
import type { SocialLink } from "@/types";

const navLinks = [
  { href: "/destinations", label: "Destinations" },
  { href: "/journeys", label: "Journeys" },
  { href: "/stories", label: "Stories" },
  { href: "/about", label: "About" },
];

interface HeaderProps {
  siteTitle?: string;
  socialLinks?: SocialLink[];
  transparent?: boolean;
}

export function Header({
  siteTitle = "Horizon",
  socialLinks = [],
  transparent = false,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      setHidden(y > lastY && y > 200);
      lastY = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openSearch = useCallback(() => setSearchOpen(true), []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !searchOpen && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        openSearch();
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "K") {
        e.preventDefault();
        setAuthOpen(true);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [searchOpen, openSearch]);

  const isSolid = scrolled || !transparent;

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isSolid
            ? "bg-header-bg backdrop-blur-md border-b border-border"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 md:h-20 flex items-center justify-between">
          <Logo
            siteTitle={siteTitle}
            onSecretActivate={() => setAuthOpen(true)}
          />

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs uppercase tracking-[0.15em] text-foreground/80 hover:text-ocean transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={openSearch}
              className="text-muted hover:text-foreground transition-colors p-1"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-muted hover:text-foreground transition-colors p-1 hidden md:block"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}

            <SocialIcons links={socialLinks} className="hidden lg:flex" />

            <button
              onClick={() => {
                setMenuOpen(!menuOpen);
                setMobileOpen(!mobileOpen);
              }}
              className="md:hidden text-foreground p-1"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait">
                {menuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <X size={22} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <Menu size={22} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => {
          setMobileOpen(false);
          setMenuOpen(false);
        }}
        socialLinks={socialLinks}
      />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CreatorAuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
