"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthSession } from "@/hooks/useAuthSession";

interface AuthNavButtonProps {
  overHero?: boolean;
  className?: string;
}

export function AuthNavButton({ overHero, className }: AuthNavButtonProps) {
  const pathname = usePathname();
  const { loading, authenticated, signOut } = useAuthSession();

  const loginHref = `/auth?redirectTo=${encodeURIComponent(pathname || "/")}`;

  if (loading) {
    return (
      <span
        className={cn(
          "adventure-pill border px-5 py-2 text-sm font-medium opacity-50",
          overHero ? "border-tone-light/30 text-tone-light" : "border-border text-muted",
          className
        )}
      >
        …
      </span>
    );
  }

  if (authenticated) {
    return (
      <button
        type="button"
        onClick={() => void signOut()}
        className={cn(
          "adventure-pill border px-5 py-2 text-sm font-medium transition-colors",
          overHero
            ? "border-tone-light/50 text-tone-light hover:bg-tone-light/10"
            : "border-border text-foreground hover:border-olive hover:text-olive",
          className
        )}
      >
        Sign out
      </button>
    );
  }

  return (
    <Link
      href={loginHref}
      className={cn(
        "adventure-pill border px-5 py-2 text-sm font-medium transition-colors",
        overHero
          ? "border-tone-light/50 text-tone-light hover:bg-tone-light/10"
          : "border-border text-foreground hover:border-olive hover:text-olive",
        className
      )}
    >
      Login
    </Link>
  );
}
