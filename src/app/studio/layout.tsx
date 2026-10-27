import { StudioShell } from "@/components/studio/StudioShell";
import { seoPageTitle } from "@/lib/config";

export const metadata = {
  title: seoPageTitle("Studio"),
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <StudioShell>{children}</StudioShell>;
}
