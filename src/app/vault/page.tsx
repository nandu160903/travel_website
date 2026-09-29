"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreatorAuthModal } from "@/components/creator/CreatorAuthModal";

export default function VaultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(true);
  const redirect = searchParams.get("redirect") ?? "/studio";

  useEffect(() => {
    if (!open) {
      router.push("/");
    }
  }, [open, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <CreatorAuthModal
        open={open}
        onClose={() => setOpen(false)}
      />
      {/* Hidden secondary access route — redirects to studio after auth */}
      <input type="hidden" value={redirect} readOnly />
    </div>
  );
}
