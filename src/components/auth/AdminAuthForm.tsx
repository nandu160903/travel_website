"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, signUp } from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";
import { Button } from "@/components/ui/Button";

type Mode = "signin" | "signup";

export function AdminAuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/studio";
  const errorParam = searchParams.get("error");

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    errorParam === "not_admin"
      ? "This account does not have admin access."
      : ""
  );
  const [loading, setLoading] = useState(false);

  const finishAuth = async () => {
    const res = await fetch("/api/auth/me");
    const data = await res.json();

    if (!data.isAdmin) {
      await Session.signOut();
      setError(
        data.configured === false
          ? "Admin is not configured on the server. Set ADMIN_EMAIL or ADMIN_USER_ID."
          : "This account is not the site admin."
      );
      return;
    }

    router.push(redirectTo);
    router.refresh();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formFields = [
        { id: "email", value: email },
        { id: "password", value: password },
      ];

      const response =
        mode === "signin"
          ? await signIn({ formFields })
          : await signUp({ formFields });

      if (response.status === "FIELD_ERROR") {
        setError(response.formFields.map((f) => f.error).join(" "));
        return;
      }

      if (response.status !== "OK") {
        setError("Authentication failed. Check your credentials.");
        return;
      }

      await finishAuth();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <p className="font-coords text-olive mb-2">Admin access</p>
        <h1 className="font-serif-heading text-3xl text-foreground">Sign in to Studio</h1>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          Manage journeys, your About page, destinations, photos, and site settings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="admin-email" className="sr-only">
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            autoComplete="email"
            className="w-full adventure-pill border border-border bg-surface px-5 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-olive"
          />
        </div>
        <div>
          <label htmlFor="admin-password" className="sr-only">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            className="w-full adventure-pill border border-border bg-surface px-5 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-olive"
          />
        </div>

        {error && <p className="text-sm text-sunset">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Please wait..." : mode === "signin" ? "Login" : "Create admin account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-muted">
        {mode === "signin" ? (
          <>
            First time here?{" "}
            <button
              type="button"
              className="text-olive hover:underline"
              onClick={() => setMode("signup")}
            >
              Register admin
            </button>
          </>
        ) : (
          <>
            Already registered?{" "}
            <button
              type="button"
              className="text-olive hover:underline"
              onClick={() => setMode("signin")}
            >
              Sign in
            </button>
          </>
        )}
      </p>

      <p className="mt-8 text-center">
        <Link href="/auth" className="text-xs text-muted hover:text-foreground mr-4">
          User login
        </Link>
        <Link href="/" className="text-xs text-muted hover:text-foreground">
          ← Back to site
        </Link>
      </p>
    </div>
  );
}
