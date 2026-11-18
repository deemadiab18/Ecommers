"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useCategories } from "../../hooks/useCategories";
import { cn } from "../../utils/cn";

export default function CategoriesMenu({ className, onNavigate, compact }) {
  const { data, isLoading, isError } = useCategories({ limit: 12 });
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handlePointer(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handlePointer);
    return () => document.removeEventListener("mousedown", handlePointer);
  }, [open]);

  const items = data?.items ?? [];

  if (compact) {
    return (
      <FlowList
        items={items}
        isLoading={isLoading}
        isError={isError}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-surface"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
      >
        Categories
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open ? (
        <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-xl border border-line bg-white p-2 shadow-lg">
          <FlowList
            items={items}
            isLoading={isLoading}
            isError={isError}
            onPick={() => {
              setOpen(false);
              onNavigate?.();
            }}
          />
          <Link
            href="/categories"
            className="mt-1 block rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-mint"
            onClick={() => {
              setOpen(false);
              onNavigate?.();
            }}
          >
            View all categories
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function FlowList({ items, isLoading, isError, onNavigate, onPick }) {
  const close = onPick || onNavigate;

  if (isLoading) {
    return <p className="px-3 py-2 text-sm text-muted">Loading categories…</p>;
  }
  if (isError) {
    return <p className="px-3 py-2 text-sm text-discount">Could not load categories</p>;
  }
  if (!items.length) {
    return <p className="px-3 py-2 text-sm text-muted">No categories yet</p>;
  }

  return (
    <ul className="max-h-64 overflow-y-auto">
      {items.map((category) => (
        <li key={category._id}>
          <Link
            href={`/products?category=${category._id}`}
            className="block rounded-lg px-3 py-2 text-sm text-ink hover:bg-mint"
            onClick={close}
          >
            {category.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}