import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-background">
      <p className="text-[10px] uppercase tracking-[0.4em] text-muted mb-6">404</p>
      <h1 className="font-display text-4xl md:text-6xl leading-tight max-w-lg">
        Looks like this path wasn&apos;t part of the journey.
      </h1>
      <p className="text-muted mt-4 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link href="/" className="mt-10">
        <Button>Take Me Home</Button>
      </Link>
    </div>
  );
}
