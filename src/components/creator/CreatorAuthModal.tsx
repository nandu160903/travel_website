"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/utils";

interface CreatorAuthModalProps {
  open: boolean;
  onClose: () => void;
  redirectTo?: string;
}

export function CreatorAuthModal({ open, onClose, redirectTo = "/studio" }: CreatorAuthModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const useSupabase = isSupabaseConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (useSupabase) {
        const supabase = createClient();
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          setError("Invalid credentials.");
          return;
        }
      } else {
        const res = await fetch("/api/studio/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error ?? "Invalid password.");
          return;
        }
      }

      onClose();
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Creator Access">
      <form onSubmit={handleSubmit} className="space-y-4">
        {useSupabase && (
          <div>
            <label htmlFor="creator-email" className="sr-only">
              Email
            </label>
            <input
              id="creator-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              autoComplete="email"
              className="w-full px-4 py-3 bg-muted-bg border border-border text-foreground placeholder:text-muted focus:outline-none focus:border-ocean transition-colors"
            />
          </div>
        )}
        <div>
          <label htmlFor="creator-password" className="sr-only">
            Password
          </label>
          <input
            id="creator-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={useSupabase ? "Password" : "Admin password"}
            required
            autoComplete="current-password"
            className="w-full px-4 py-3 bg-muted-bg border border-border text-foreground placeholder:text-muted focus:outline-none focus:border-ocean transition-colors"
          />
        </div>
        {error && <p className="text-sm text-sunset">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Entering..." : "Continue"}
        </Button>
      </form>
    </Modal>
  );
}
