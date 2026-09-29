import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import { siteConfig } from "@/lib/config";
import { createMetadata } from "@/lib/seo/metadata";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = createMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${dmSerif.variable} ${manrope.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
