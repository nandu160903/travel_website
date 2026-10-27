"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { X } from "lucide-react";
import { SocialIcons } from "./SocialIcons";
import { cn } from "@/lib/utils";
import type { SocialLink } from "@/types";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/journeys", label: "Journeys" },
  { href: "/destinations", label: "Destinations" },
  { href: "/photos", label: "Photos" },
];

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  socialLinks: SocialLink[];
  backgroundImage?: string;
}

export function MobileMenu({ open, onClose, socialLinks, backgroundImage }: MobileMenuProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

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
          transition={{ duration: 0.32 }}
          className="fixed inset-0 z-[80]"
        >
          <motion.div
            initial={{ scale: 1.04, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.02, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image src={bg} alt="" fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-tone-dark/85" />
          </motion.div>

          <div className="relative flex flex-col h-full px-6 sm:px-8 py-24 safe-top safe-bottom safe-x">
            <button
              type="button"
              onClick={onClose}
              className="touch-target absolute top-[max(1rem,env(safe-area-inset-top,0px))] right-4 inline-flex items-center justify-center text-tone-light/80"
              aria-label="Close menu"
            >
              <X size={26} />
            </button>
            <p className="travel-meta text-tone-light/40 mb-8 mt-10">Menu · Field Atlas</p>
            <nav className="flex-1 flex flex-col justify-center gap-5 md:gap-7">
              {navLinks.map((link, i) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: open ? i * 0.05 : 0, duration: 0.35 }}
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={cn(
                        "font-display text-3xl sm:text-4xl font-bold text-tone-light leading-[0.95] block transition-colors uppercase tracking-tight",
                        active ? "text-trail" : "hover:text-trail/85"
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
              className="justify-center [&_a]:text-tone-light/60 [&_a:hover]:text-trail [&_span]:text-tone-light/60 [&_a:hover_span]:text-trail"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
