"use client";

import { ThemeProvider } from "next-themes";
import { CustomCursor } from "@/components/layout/CustomCursor";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
      <CustomCursor />
      {children}
    </ThemeProvider>
  );
}
