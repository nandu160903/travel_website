"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, signUp } from "supertokens-auth-react/recipe/emailpassword";
import { Button } from "@/components/ui/Button";
import { safeRedirectPath } from "@/lib/security/safeRedirect";

type Mode = "signin" | "signup";

export function UserAuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = safeRedirectPath(searchParams.get("redirectTo"), "/");

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <p className="font-coords text-olive mb-2">Welcome</p>
        <h1 className="font-serif-heading text-3xl text-foreground">
          {mode === "signin" ? "Sign in" : "Create account"}
        </h1>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          Log in to chat about journeys, places, and tips from this site.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          id="user-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          autoComplete="email"
          className="w-full adventure-pill border border-border bg-surface px-5 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-olive"
        />
        <input
          id="user-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          className="w-full adventure-pill border border-border bg-surface px-5 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-olive"
        />

        {error && <p className="text-sm text-sunset">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Sign up"}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-muted">
        {mode === "signin" ? (
          <>
            New here?{" "}
            <button
              type="button"
              className="text-olive hover:underline"
              onClick={() => setMode("signup")}
            >
              Create an account
            </button>
          </>
        ) : (
          <>
            Have an account?{" "}
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

      <p className="mt-6 text-center text-xs text-muted">
        Site owner?{" "}
        <Link href="/auth/studio" className="text-olive hover:underline">
          Studio login
        </Link>
      </p>

      <p className="mt-8 text-center">
        <Link href="/" className="text-xs text-muted hover:text-foreground">
          ← Back to site
        </Link>
      </p>
    </div>
  );
}
