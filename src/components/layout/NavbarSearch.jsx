"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "../../utils/cn";

export default function NavbarSearch({ className, id = "nav-search", onDone }) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  function submit(event) {
    event.preventDefault();
    const q = keyword.trim();
    if (!q) return;
    router.push(`/products?keyword=${encodeURIComponent(q)}`);
    onDone?.();
  }

  return (
    <form onSubmit={submit} className={cn("relative w-full max-w-md", className)} role="search">
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <input
        id={id}
        type="search"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder="Search products…"
        className="h-10 w-full rounded-xl border border-line bg-surface pl-10 pr-3 text-sm text-ink placeholder:text-muted focus:border-primary focus:bg-white"
        autoComplete="off"
      />
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
    </form>
  );
}