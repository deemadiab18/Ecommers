"use client";

import { useAuth } from "@/context/AuthContext";
import Spinner from "@/components/ui/Spinner";

export default function AuthBootstrap({ children }) {
  const { status } = useAuth();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <Spinner label="Checking your session…" />
      </div>
    );
  }

  return children;
}