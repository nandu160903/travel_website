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
        heroImage={settings.heroImage}
      />
      <main className="min-w-0 flex-1 overflow-x-clip">{children}</main>
      <Footer
        siteTitle={settings.siteTitle}
        socialLinks={socialLinks}
        contactEmail={settings.email}
      />
    </>
  );
}
