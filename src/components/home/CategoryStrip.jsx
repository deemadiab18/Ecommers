"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Container from "../layout/Container";
import Button from "../ui/Button";
import { useCategories } from "../../hooks/useCategories";
import { resolveMediaUrl } from "../../utils/media";

export default function CategoryStrip() {
  const { data, isLoading, isError, refetch } = useCategories({ limit: 10 });
  const items = data?.items ?? [];

  return (
    <section className="border-b border-line bg-white py-10">
      <Container>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-ink">Shop by category</h2>
            <p className="mt-1 text-sm text-muted">Browse aisles curated for your everyday needs.</p>
          </div>
          <Link href="/categories" className="text-sm font-semibold text-primary hover:underline">
            All categories
          </Link>
        </div>

        {isLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="h-40 w-36 shrink-0 animate-pulse rounded-2xl bg-surface" />
            ))}
          </div>
        ) : null}

        {isError ? (
          <div className="rounded-2xl border border-line p-6 text-center">
            <p className="text-sm text-muted">Could not load categories.</p>
            <Button type="button" className="mt-3" variant="secondary" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : null}

        {!isLoading && !isError ? (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
            {items.map((category) => (
              <Link
                key={category._id}
                href={`/products?category=${category._id}`}
                className="group w-36 shrink-0 rounded-2xl border border-line bg-surface p-3 transition-shadow hover:shadow-card"
              >
                <div className="aspect-square overflow-hidden rounded-xl bg-white">
                  {category.image ? (
                    <img
                      src={resolveMediaUrl(category.image)}
                      alt={category.name}
                      loading="lazy"
                      className="size-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-xs text-muted">No image</div>
                  )}
                </div>
                <p className="mt-3 line-clamp-2 text-sm font-semibold text-ink">{category.name}</p>
                <span className="mt-1 inline-flex items-center text-xs font-medium text-primary">
                  Shop
                  <ChevronRight className="size-3" aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
}