"use client";

import { Suspense } from "react";
import GuestRoute from "@/routes/GuestRoute";
import Spinner from "@/components/ui/Spinner";

export default function AuthLayout({ children }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-canvas">
          <Spinner label="Loading…" />
        </div>
      }
    >
      <GuestRoute>{children}</GuestRoute>
    </Suspense>
  );
}