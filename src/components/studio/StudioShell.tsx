"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { StudioSidebar } from "./StudioSidebar";

export function StudioShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-dvh bg-background">
      <div className="hidden lg:block shrink-0">
        <StudioSidebar />
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-tone-dark/70"
            aria-label="Close studio menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className="relative h-full w-[min(100%,18rem)] max-w-[85vw] shadow-2xl">
            <StudioSidebar
              className="h-dvh w-full sticky top-0"
              onNavigate={() => setMenuOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur-md safe-top lg:hidden">
          <button
            type="button"
            className="touch-target inline-flex items-center justify-center rounded-sm text-foreground"
            aria-label={menuOpen ? "Close studio menu" : "Open studio menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <p className="font-display text-lg">Studio</p>
        </header>
        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-clip">{children}</main>
      </div>
    </div>
  );
}
