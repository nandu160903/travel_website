import Link from "next/link";
import { SocialIcons } from "./SocialIcons";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import type { SocialLink } from "@/types";

const footerNav = [
  { href: "/journeys", label: "Journeys" },
  { href: "/destinations", label: "Destinations" },
  { href: "/stories", label: "Stories" },
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
  siteTitle = "Horizon",
  socialLinks = [],
  contactEmail = "hello@example.com",
}: FooterProps) {
  return (
    <footer className="relative mt-24 border-t border-border bg-muted-bg">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          <div className="md:col-span-5">
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.2] font-bold flex flex-col gap-2 text-foreground">
              <span>Keep</span>
              <span className="text-gold">Wandering</span>
            </h2>
            <p className="mt-6 text-muted text-sm max-w-sm leading-relaxed">
              The world is a book, and those who do not travel read only one page.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="travel-meta mb-6">Explore</p>
            <nav className="flex flex-col gap-2.5">
              {footerNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="md:col-span-4">
            <p className="travel-meta mb-6">Stay Connected</p>
            <SocialIcons links={socialLinks} className="mb-6 [&_a]:text-muted [&_a:hover]:text-gold" />
            <a
              href={`mailto:${contactEmail}`}
              className="text-sm text-muted hover:text-gold transition-colors block mb-8"
            >
              {contactEmail}
            </a>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {siteTitle}. All journeys documented with care.
          </p>
          <p className="travel-meta opacity-60">Demo content — replace with your own</p>
        </div>
      </div>
    </footer>
  );
}
