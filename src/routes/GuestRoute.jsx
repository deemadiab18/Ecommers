"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function GuestRoute({ children }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "authenticated") router.replace("/");
  }, [status, router]);

  if (status === "loading") return null;
  if (status === "authenticated") return null;

  return children;
}