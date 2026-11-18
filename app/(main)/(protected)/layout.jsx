"use client";

import { Suspense } from "react";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Spinner from "@/components/ui/Spinner";

export default function ProtectedLayout({ children }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner label="Loading…" />
        </div>
      }
    >
      <ProtectedRoute>{children}</ProtectedRoute>
    </Suspense>
  );
}