"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  BookOpen,
  Camera,
  Video,
  Map,
  FolderOpen,
  Settings,
  Plane,
  LogOut,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/utils";

const navItems = [
  { href: "/studio", label: "Overview", icon: LayoutDashboard },
  { href: "/studio/trips", label: "Journeys", icon: Plane },
  { href: "/studio/destinations", label: "Destinations", icon: MapPin },
  { href: "/studio/stories", label: "Stories", icon: BookOpen },
  { href: "/studio/photos", label: "Photos", icon: Camera },
  { href: "/studio/videos", label: "Videos", icon: Video },
  { href: "/studio/map", label: "Map", icon: Map },
  { href: "/studio/media", label: "Media", icon: FolderOpen },
  { href: "/studio/settings", label: "Settings", icon: Settings },
];

export function StudioSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    } else {
      await fetch("/api/studio/auth", { method: "DELETE" });
    }
    router.push("/");
    router.refresh();
  };

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-border">
        <p className="font-display text-xl">Studio</p>
        <p className="text-[10px] uppercase tracking-widest text-muted mt-1">Content Admin</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/studio" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm transition-colors rounded-sm",
                active
                  ? "bg-ocean/10 text-ocean"
                  : "text-muted hover:text-foreground hover:bg-muted-bg"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted hover:text-foreground transition-colors"
        >
          <Globe size={18} />
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted hover:text-sunset transition-colors w-full"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
