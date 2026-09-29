import { Header } from "./Header";
import { Footer } from "./Footer";
import { getSiteSettings } from "@/lib/data/queries";
import { getSocialLinks } from "@/lib/config";

interface PublicLayoutProps {
  children: React.ReactNode;
  transparentHeader?: boolean;
}

export async function PublicLayout({
  children,
  transparentHeader = false,
}: PublicLayoutProps) {
  const settings = await getSiteSettings();
  const socialLinks =
    settings.socialLinks.length > 0 ? settings.socialLinks : getSocialLinks();

  return (
    <>
      <Header
        siteTitle={settings.siteTitle}
        socialLinks={socialLinks}
        transparent={transparentHeader}
      />
      <main className="flex-1">{children}</main>
      <Footer
        siteTitle={settings.siteTitle}
        socialLinks={socialLinks}
        contactEmail={settings.email}
      />
    </>
  );
}
