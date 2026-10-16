"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { AuthNavButton } from "./AuthNavButton";
import { MobileMenu } from "./MobileMenu";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import type { SocialLink } from "@/types";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/journeys", label: "Journeys" },
];

interface HeaderProps {
  siteTitle?: string;
  socialLinks?: SocialLink[];
  transparent?: boolean;
  heroImage?: string;
}

export function Header({
  siteTitle = "Horizon",
  socialLinks: _socialLinks = [],
  transparent = false,
  heroImage,
}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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
        router.push("/auth");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [searchOpen, openSearch, router]);

  const overHero = transparent && !scrolled;

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
            "max-w-7xl mx-auto px-4 sm:px-6 md:px-10 min-h-16 md:min-h-[4.75rem] py-2 flex items-center gap-3 md:gap-8 transition-all duration-500",
            scrolled ? "bg-header-bg/95 backdrop-blur-md border-b border-border" : "bg-transparent"
          )}
        >
          <Logo siteTitle={siteTitle} light={overHero} wordmark />

          <button
            type="button"
            onClick={openSearch}
            className={cn(
              "hidden lg:flex flex-1 max-w-md mx-auto items-center gap-3 adventure-pill border px-5 py-2.5 text-sm transition-colors",
              overHero
                ? "border-tone-light/20 bg-black/25 text-tone-light/55 hover:border-tone-light/35"
                : "border-border bg-surface text-muted hover:text-foreground"
            )}
          >
            <Search size={16} strokeWidth={1.75} />
            <span>Search...</span>
          </button>

          <nav className="hidden lg:flex items-center gap-8 xl:gap-10 ml-auto">
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors relative pb-1",
                    overHero ? "text-tone-light/85 hover:text-tone-light" : "text-foreground/85 hover:text-foreground",
                    active && "text-olive"
                  )}
                >
                  {link.label}
                  {active && (
                    <span className="absolute left-0 right-0 -bottom-0.5 h-px bg-olive" />
                  )}
                </Link>
              );
            })}
            <AuthNavButton overHero={overHero} />
          </nav>

          <div className="flex items-center gap-2 ml-auto lg:ml-0">
            <button
              onClick={openSearch}
              className={cn(
                "lg:hidden p-2 transition-colors",
                overHero ? "text-tone-light/80" : "text-foreground/70"
              )}
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => {
                setMenuOpen(!menuOpen);
                setMobileOpen(!mobileOpen);
              }}
              className={cn(
                "lg:hidden p-2 transition-colors",
                overHero ? "text-tone-light/80" : "text-foreground/70"
              )}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait">
                {menuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <X size={22} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
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
        socialLinks={_socialLinks}
        backgroundImage={heroImage}
      />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
