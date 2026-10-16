import { Suspense } from "react";
import { UserAuthForm } from "@/components/auth/UserAuthForm";

export const metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-24">
      <Suspense fallback={<div className="text-muted text-sm">Loading...</div>}>
        <UserAuthForm />
      </Suspense>
    </div>
  );
}
