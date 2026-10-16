"use client";

import { CustomCursor } from "@/components/layout/CustomCursor";
import { SuperTokensProvider } from "@/components/providers/SuperTokensProvider";
import { TravelChatWidget } from "@/components/chat/TravelChatWidget";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SuperTokensProvider>
      <CustomCursor />
      {children}
      <TravelChatWidget />
    </SuperTokensProvider>
  );
}
