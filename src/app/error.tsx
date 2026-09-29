"use client";

import { Button } from "@/components/ui/Button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-background">
      <p className="text-[10px] uppercase tracking-[0.4em] text-sunset mb-6">Error</p>
      <h1 className="font-display text-4xl md:text-5xl leading-tight">
        Something went off route.
      </h1>
      <p className="text-muted mt-4 max-w-md">
        An unexpected error occurred. Please try again.
      </p>
      <Button onClick={reset} className="mt-10">
        Try Again
      </Button>
    </div>
  );
}
