"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Spinner from "@/components/ui/Spinner";

export default function ProtectedRoute({ children }) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (status === "loading") return;
    if (status !== "authenticated") {
      const query = searchParams.toString();
      const from = encodeURIComponent(pathname + (query ? `?${query}` : ""));
      router.replace(`/login?from=${from}`);
    }
  }, [status, router, pathname, searchParams]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner label="Loading…" />
      </div>
    );
  }

  if (status !== "authenticated") return null;

  return children;
}