"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  BookOpen,
  UserRound,
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
import Session from "supertokens-auth-react/recipe/session";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/utils";
import { isSuperTokensEnabled } from "@/lib/supertokens/admin";
import { studioApiPath, studioPagePath } from "@/lib/studio/paths";

const navItems = [
  { subpath: "", label: "Overview", icon: LayoutDashboard },
  { subpath: "/trips", label: "Journeys", icon: Plane },
  { subpath: "/about", label: "About Page", icon: UserRound },
  { subpath: "/destinations", label: "Destinations", icon: MapPin },
  { subpath: "/stories", label: "Stories", icon: BookOpen },
  { subpath: "/photos", label: "Photos", icon: Camera },
  { subpath: "/videos", label: "Videos", icon: Video },
  { subpath: "/map", label: "Map", icon: Map },
  { subpath: "/media", label: "Media", icon: FolderOpen },
  { subpath: "/settings", label: "Settings", icon: Settings },
];

interface StudioSidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function StudioSidebar({ className, onNavigate }: StudioSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const studioHome = studioPagePath();

  const handleLogout = async () => {
    if (isSuperTokensEnabled()) {
      await Session.signOut();
    } else if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    } else {
      await fetch(studioApiPath("/auth"), { method: "DELETE" });
    }
    router.push("/");
    router.refresh();
  };

  return (
    <aside
      className={cn(
        "flex h-screen w-64 shrink-0 flex-col border-r border-border bg-card sticky top-0",
        className
      )}
    >
      <div className="p-6 border-b border-border">
        <p className="font-display text-xl">Studio</p>
        <p className="text-[10px] uppercase tracking-widest text-muted mt-1">Content Admin</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const href = studioPagePath(item.subpath);
          const active =
            pathname === href || (href !== studioHome && pathname.startsWith(href));
          return (
            <Link
              key={item.subpath || "home"}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors",
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
