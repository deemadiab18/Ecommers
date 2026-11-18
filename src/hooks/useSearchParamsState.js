"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * React Router–style tuple API on top of Next.js search params.
 */
export function useSearchParamsState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const setSearchParams = useCallback(
    (next, options = {}) => {
      let params;
      if (next instanceof URLSearchParams) {
        params = next;
      } else if (typeof next === "object" && next !== null) {
        params = new URLSearchParams();
        for (const [key, value] of Object.entries(next)) {
          if (value != null && value !== "") params.set(key, String(value));
        }
      } else {
        params = new URLSearchParams();
      }
      const qs = params.toString();
      const href = qs ? `${pathname}?${qs}` : pathname;
      if (options.replace) router.replace(href);
      else router.push(href);
    },
    [pathname, router],
  );

  return [searchParams, setSearchParams];
}