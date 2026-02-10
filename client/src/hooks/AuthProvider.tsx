import React, { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./useAuthContext";
import * as auth from "../services/auth";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<auth.User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const stored = localStorage.getItem("token");
      if (!stored) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const me = await auth.fetchMe(stored);
        if (!isMounted) return;
        setUser(me);
        setToken(stored);
      } catch {
        localStorage.removeItem("token");
        if (!isMounted) return;
        setUser(null);
        setToken(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { access_token } = await auth.login(email, password);
    const me = await auth.fetchMe(access_token);

    localStorage.setItem("token", access_token);
    setToken(access_token);
    setUser(me);
  };

  // services/auth.ts register() does NOT return a token
  // -> register then login

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  const value = useMemo(() => {
    const register = async (email: string, password: string) => {
      await auth.register(email, password);
      await login(email, password);
    };
    return { user, token, loading, login, register, logout };
  }, [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
