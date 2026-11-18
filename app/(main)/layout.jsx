"use client";

import { Suspense } from "react";
import MainLayout from "@/components/layout/MainLayout";
import Spinner from "@/components/ui/Spinner";

export default function ShopLayout({ children }) {
  return (
    <MainLayout>
      <Suspense
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center">
            <Spinner label="Loading…" />
          </div>
        }
      >
        {children}
      </Suspense>
    </MainLayout>
  );
}