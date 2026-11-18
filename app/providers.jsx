"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { queryClient } from "@/api/queryClient";
import { AuthProvider } from "@/context/AuthContext";
import AuthBootstrap from "@/routes/AuthBootstrap";
import ErrorBoundary from "@/components/ErrorBoundary";

export function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthBootstrap>
          <ErrorBoundary>{children}</ErrorBoundary>
        </AuthBootstrap>
      </AuthProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          className: "!rounded-xl !text-sm !shadow-lg",
          duration: 3500,
        }}
      />
    </QueryClientProvider>
  );
}