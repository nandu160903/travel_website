"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SocialIcons } from "./SocialIcons";
import { cn } from "@/lib/utils";
import type { SocialLink } from "@/types";

const navLinks = [
  { href: "/journeys", label: "Journeys" },
  { href: "/destinations", label: "Destinations" },
  { href: "/stories", label: "Stories" },
  { href: "/photos", label: "Photos" },
  { href: "/map", label: "Map" },
  { href: "/about", label: "About" },
];

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  socialLinks: SocialLink[];
  backgroundImage?: string;
}

export function MobileMenu({ open, onClose, socialLinks, backgroundImage }: MobileMenuProps) {
  const pathname = usePathname();
  const bg =
    backgroundImage ??
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80]"
        >
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.05, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image src={bg} alt="" fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-tone-dark/80 backdrop-blur-sm" />
          </motion.div>

          <div className="relative flex flex-col h-full px-8 py-28">
            <nav className="flex-1 flex flex-col justify-center gap-6 md:gap-8">
              {navLinks.map((link, i) => {
                const active = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ delay: open ? i * 0.06 : 0 }}
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={cn(
                        "font-display text-3xl sm:text-4xl md:text-5xl font-bold text-tone-light leading-[1.25] block transition-colors",
                        active ? "text-gold" : "hover:text-gold/80"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
            <SocialIcons
              links={socialLinks}
              size="md"
              className="justify-center [&_a]:text-tone-light/70 [&_a:hover]:text-gold"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
