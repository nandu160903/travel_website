"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SuperTokensWrapper } from "supertokens-auth-react";
import SuperTokensReact from "supertokens-auth-react";
import { frontendConfig, setSuperTokensRouter } from "@/lib/supertokens/frontend";

let clientInitialized = false;

function initSuperTokensOnClient() {
  if (typeof window === "undefined" || clientInitialized) {
    return false;
  }
  SuperTokensReact.init(frontendConfig());
  clientInitialized = true;
  return true;
}

export function SuperTokensProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready] = useState(() => initSuperTokensOnClient());

  useEffect(() => {
    if (ready) {
      setSuperTokensRouter(router, pathname || window.location.pathname);
    }
  }, [ready, router, pathname]);

  if (!ready) {
    return <>{children}</>;
  }

  return <SuperTokensWrapper>{children}</SuperTokensWrapper>;
}
