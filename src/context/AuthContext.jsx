"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { verifyToken } from "@/api/auth";
import { setUnauthorizedHandler } from "@/api/client";
import { queryClient } from "@/api/queryClient";
import { clearSession, readToken, readUser, writeSession } from "@/utils/storage";

const AuthContext = createContext(null);

function sessionFromPayload(payload) {
  const decoded = jwtDecode(payload.token);
  const previous = readUser();
  return {
    id: decoded.id,
    name: payload.user?.name || decoded.name || previous?.name || "",
    email: payload.user?.email || previous?.email || "",
    role: payload.user?.role || decoded.role || "user",
  };
}

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("guest");

  function setSession(payload) {
    const nextUser = sessionFromPayload(payload);
    writeSession(payload.token, nextUser);
    setUser(nextUser);
    setStatus("authenticated");
    return nextUser;
  }

  function logout({ redirect = true } = {}) {
    clearSession();
    setUser(null);
    setStatus("guest");
    queryClient.clear();
    if (redirect) router.push("/");
  }

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession();
      setUser(null);
      setStatus("guest");
      queryClient.clear();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        router.replace("/login");
      }
    });
    return () => setUnauthorizedHandler(() => {});
  }, [router]);

  useEffect(() => {
    const token = readToken();
    if (!token) {
      setStatus("guest");
      return;
    }
    setUser(readUser());
    setStatus("loading");
    let cancelled = false;
    verifyToken()
      .then((data) => {
        if (cancelled) return;
        const decoded = data?.decoded || jwtDecode(token);
        const previous = readUser();
        const nextUser = {
          id: decoded.id,
          name: decoded.name || previous?.name || "",
          email: previous?.email || "",
          role: decoded.role || previous?.role || "user",
        };
        writeSession(token, nextUser);
        setUser(nextUser);
        setStatus("authenticated");
      })
      .catch((error) => {
        if (cancelled) return;
        if (error?.response?.status === 401) return;
        setStatus(readUser() ? "authenticated" : "guest");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function patchUser(partial) {
    setUser((previous) => {
      if (!previous) return previous;
      const next = { ...previous, ...partial };
      const token = readToken();
      if (token) writeSession(token, next);
      return next;
    });
  }

  const value = useMemo(() => ({ user, status, setSession, patchUser, logout }), [user, status]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}