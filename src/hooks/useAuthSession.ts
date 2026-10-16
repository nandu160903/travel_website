"use client";

import { useCallback, useEffect, useState } from "react";
import Session from "supertokens-auth-react/recipe/session";

export type AuthSession = {
  loading: boolean;
  authenticated: boolean;
  isAdmin: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

export function useAuthSession(): AuthSession {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const exists = await Session.doesSessionExist();
      if (!exists) {
        setAuthenticated(false);
        setIsAdmin(false);
        return;
      }
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setAuthenticated(Boolean(data.authenticated));
      setIsAdmin(Boolean(data.isAdmin));
    } catch {
      setAuthenticated(false);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      void refresh();
    });
    return () => cancelAnimationFrame(frame);
  }, [refresh]);

  const signOut = useCallback(async () => {
    await Session.signOut();
    setAuthenticated(false);
    setIsAdmin(false);
  }, []);

  return { loading, authenticated, isAdmin, refresh, signOut };
}
