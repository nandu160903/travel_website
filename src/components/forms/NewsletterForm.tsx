"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p className="text-sm text-ivory/70 dark:text-muted">
        Thank you — you&apos;re on the list.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        required
        className="flex-1 px-4 py-2 bg-ivory/10 dark:bg-muted-bg border border-ivory/20 dark:border-border text-ivory dark:text-foreground placeholder:text-ivory/40 dark:placeholder:text-muted text-sm focus:outline-none focus:border-ocean"
      />
      <Button type="submit" size="sm" disabled={status === "loading"}>
        {status === "loading" ? "..." : "Subscribe"}
      </Button>
    </form>
  );
}
