import { StudioSidebar } from "@/components/studio/StudioSidebar";

export const metadata = {
  title: "Studio — Horizon Journal",
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <StudioSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
