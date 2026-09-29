"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { SocialIcons } from "./SocialIcons";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { CreatorAuthModal } from "@/components/creator/CreatorAuthModal";
import type { SocialLink } from "@/types";

const navLinks = [
  { href: "/journeys", label: "Journeys" },
  { href: "/destinations", label: "Destinations" },
  { href: "/stories", label: "Stories" },
  { href: "/photos", label: "Photos" },
  { href: "/map", label: "Map" },
  { href: "/about", label: "About" },
];

interface HeaderProps {
  siteTitle?: string;
  socialLinks?: SocialLink[];
  transparent?: boolean;
  heroImage?: string;
}

export function Header({
  siteTitle = "Horizon",
  socialLinks = [],
  transparent = false,
  heroImage,
}: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > lastY && y > 180);
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

  const overHero = transparent && !scrolled;
  const navClass = overHero
    ? "text-[var(--nav-text-hero)]/90 hover:text-[var(--nav-text-hero)]"
    : "text-nav-text/85 hover:text-forest dark:hover:text-gold";
  const iconClass = overHero
    ? "text-[var(--nav-text-hero)]/80 hover:text-[var(--nav-text-hero)]"
    : "text-nav-text/70 hover:text-forest dark:hover:text-gold";

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.35 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      >
        <div
          className={cn(
            "max-w-7xl mx-auto px-6 md:px-8 h-16 md:h-[4.5rem] flex items-center justify-between transition-all duration-500",
            scrolled
              ? "bg-header-bg/90 backdrop-blur-md border-b border-border/50"
              : "bg-transparent"
          )}
        >
          <Logo
            siteTitle={siteTitle}
            onSecretActivate={() => setAuthOpen(true)}
            light={overHero}
          />

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "travel-meta transition-colors duration-300",
                    navClass,
                    active && !overHero && "text-forest dark:text-gold",
                    active && overHero && "text-tone-light"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <button onClick={openSearch} className={cn("p-2 transition-colors", iconClass)} aria-label="Search">
              <Search size={18} />
            </button>

            <SocialIcons
              links={socialLinks}
              className={cn(
                "hidden md:flex",
                overHero
                  ? "[&_a]:text-tone-light/75 [&_a:hover]:text-tone-light"
                  : "[&_a]:text-nav-text/70 [&_a:hover]:text-forest dark:[&_a:hover]:text-gold"
              )}
            />

            <button
              onClick={() => {
                setMenuOpen(!menuOpen);
                setMobileOpen(!mobileOpen);
              }}
              className={cn("lg:hidden p-2 transition-colors", iconClass)}
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
        backgroundImage={heroImage}
      />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CreatorAuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
