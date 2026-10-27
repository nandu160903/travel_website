import Link from "next/link";
import { SocialIcons } from "./SocialIcons";
import type { SocialLink } from "@/types";

const footerNav = [
  { href: "/journeys", label: "Journeys" },
  { href: "/destinations", label: "Destinations" },
  { href: "/photos", label: "Photos" },
  { href: "/map", label: "Map" },
  { href: "/about", label: "About" },
];

interface FooterProps {
  siteTitle?: string;
  socialLinks?: SocialLink[];
  contactEmail?: string;
}

export function Footer({
  siteTitle = "Normad on two wheels",
  socialLinks = [],
  contactEmail = "battlegroundsmobileindia69@gmail.com",
}: FooterProps) {
  return (
    <footer className="relative border-t border-border bg-tone-dark text-paper">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          <div className="md:col-span-5">
            <p className="travel-meta text-olive mb-4">Personal journal</p>
            <h2 className="font-serif-heading text-4xl sm:text-5xl md:text-[3.25rem] leading-tight text-paper">
              My trips, photos, and notes
            </h2>
            <p className="mt-6 text-paper/60 text-sm max-w-sm leading-relaxed font-sans">
              Routes, photos, and honest notes from the saddle — not a guidebook, just my riding
              journal.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="travel-meta mb-6 text-paper/45">Explore</p>
            <nav className="flex flex-col gap-3">
              {footerNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-paper/70 hover:text-olive transition-colors duration-[var(--duration-micro)] w-fit inline-flex items-center gap-2 group"
                >
                  {link.label}
                  <span aria-hidden className="transition-transform duration-[var(--duration-micro)] group-hover:translate-x-1">→</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="md:col-span-4">
            <p className="travel-meta mb-6 text-paper/45">Elsewhere</p>
            <SocialIcons
              links={socialLinks}
              className="mb-6 [&_a]:text-paper/55 [&_a:hover]:text-olive [&_span]:text-paper/55 [&_a:hover_span]:text-olive"
            />
            <a
              href={`mailto:${contactEmail}`}
              className="font-coords text-paper/55 hover:text-olive transition-colors block"
            >
              {contactEmail}
            </a>
          </div>
        </div>

        <div className="editorial-rule-gradient mt-16 mb-8 max-w-full opacity-40" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-paper/45">
            © {new Date().getFullYear()} {siteTitle}. All journeys documented with care.
          </p>
          <p className="travel-meta text-paper/35">Riding, writing, photographing.</p>
        </div>
      </div>
    </footer>
  );
}
