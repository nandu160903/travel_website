"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
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
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const overHero = transparent && !scrolled;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div
          className={cn(
            "layout-shell max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-10 min-h-16 md:min-h-[4.75rem] py-2 flex items-center gap-3 md:gap-8 safe-top",
            transparent
              ? "bg-transparent"
              : "bg-header-bg/95 backdrop-blur-md border-b border-border"
          )}
        >
          <Logo siteTitle={siteTitle} light={overHero} wordmark />

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
          </nav>

          <div className="flex items-center gap-2 ml-auto lg:ml-0">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(!menuOpen);
                setMobileOpen(!mobileOpen);
              }}
              className={cn(
                "lg:hidden touch-target inline-flex items-center justify-center transition-colors",
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
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => {
          setMobileOpen(false);
          setMenuOpen(false);
        }}
        socialLinks={_socialLinks}
        backgroundImage={heroImage}
      />
    </>
  );
}
