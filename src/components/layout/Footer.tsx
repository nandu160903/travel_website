import Link from "next/link";
import { SocialIcons } from "./SocialIcons";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import type { SocialLink } from "@/types";

const footerNav = [
  { href: "/destinations", label: "Destinations" },
  { href: "/journeys", label: "Journeys" },
  { href: "/stories", label: "Stories" },
  { href: "/photos", label: "Photos" },
  { href: "/videos", label: "Videos" },
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
    <footer className="bg-charcoal text-ivory dark:bg-muted-bg dark:text-foreground mt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          <div className="md:col-span-5">
            <h2 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight">
              KEEP{"\n"}WANDERING.
            </h2>
            <p className="mt-6 text-ivory/60 dark:text-muted text-sm max-w-sm leading-relaxed italic">
              &ldquo;The world is a book, and those who do not travel read only one page.&rdquo;
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-ivory/40 dark:text-muted mb-6">
              Explore
            </p>
            <nav className="flex flex-col gap-3">
              {footerNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-ivory/70 dark:text-muted hover:text-ivory dark:hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="md:col-span-4">
            <p className="text-[10px] uppercase tracking-[0.3em] text-ivory/40 dark:text-muted mb-6">
              Stay Connected
            </p>
            <SocialIcons links={socialLinks} className="mb-6 [&_a]:text-ivory/70 [&_a:hover]:text-ivory" />
            <a
              href={`mailto:${contactEmail}`}
              className="text-sm text-ivory/70 dark:text-muted hover:text-ivory transition-colors block mb-8"
            >
              {contactEmail}
            </a>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-ivory/10 dark:border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-ivory/40 dark:text-muted">
            © {new Date().getFullYear()} {siteTitle}. All journeys documented with care.
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-ivory/30 dark:text-muted">
            Demo content — replace with your own stories
          </p>
        </div>
      </div>
    </footer>
  );
}
