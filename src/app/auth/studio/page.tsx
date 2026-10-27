import { Suspense } from "react";
import { AdminAuthForm } from "@/components/auth/AdminAuthForm";

export const metadata = {
  title: "Studio login",
  robots: { index: false, follow: false },
};

export default function StudioAuthPage() {
  const allowRegistration = !process.env.ADMIN_USER_ID?.trim();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-24">
      <Suspense fallback={<div className="text-muted text-sm">Loading...</div>}>
        <AdminAuthForm allowRegistration={allowRegistration} />
      </Suspense>
    </div>
  );
}
