"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { SocialIcons } from "./SocialIcons";
import type { SocialLink } from "@/types";

const navLinks = [
  { href: "/destinations", label: "Destinations" },
  { href: "/journeys", label: "Journeys" },
  { href: "/stories", label: "Stories" },
  { href: "/photos", label: "Photos" },
  { href: "/videos", label: "Videos" },
  { href: "/map", label: "Map" },
  { href: "/about", label: "About" },
];

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  socialLinks: SocialLink[];
}

export function MobileMenu({ open, onClose, socialLinks }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-background"
        >
          <div className="flex flex-col h-full px-8 py-24">
            <nav className="flex-1 flex flex-col justify-center gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="font-display text-4xl text-foreground hover:text-ocean transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <SocialIcons links={socialLinks} size="md" className="justify-center" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
