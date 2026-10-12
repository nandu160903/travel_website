"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function NewsletterForm({ className }: { className?: string }) {
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
    return <p className="text-sm text-paper/60">Thank you — you&apos;re on the list.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col sm:flex-row gap-2", className)}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        required
        className="flex-1 px-4 py-2.5 bg-paper/5 border border-paper/15 text-paper placeholder:text-paper/35 text-sm focus:outline-none focus:border-trail transition-colors"
      />
      <Button
        type="submit"
        size="sm"
        variant="secondary"
        disabled={status === "loading"}
        className="shrink-0"
      >
        {status === "loading" ? "..." : "Subscribe"}
      </Button>
    </form>
  );
}
