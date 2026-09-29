"use client";

import { CustomCursor } from "@/components/layout/CustomCursor";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomCursor />
      {children}
    </>
  );
}
