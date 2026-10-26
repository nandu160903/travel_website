import { StudioShell } from "@/components/studio/StudioShell";

export const metadata = {
  title: "Studio — Horizon Journal",
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <StudioShell>{children}</StudioShell>;
}
