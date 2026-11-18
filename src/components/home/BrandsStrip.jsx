"use client";

import Link from "next/link";
import Container from "../layout/Container";
import Button from "../ui/Button";
import { useBrands } from "../../hooks/useBrands";
import { resolveMediaUrl } from "../../utils/media";

export default function BrandsStrip() {
  const { data, isLoading, isError, refetch } = useBrands({ limit: 12, page: 1 });
  const items = data?.items ?? [];

  return (
    <section className="border-y border-line bg-surface py-10">
      <Container>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-ink">Popular brands</h2>
            <p className="mt-1 text-sm text-muted">Trusted names across fashion, tech, and home.</p>
          </div>
          <Link href="/brands" className="text-sm font-semibold text-primary hover:underline">
            View all brands
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="aspect-[3/2] animate-pulse rounded-xl bg-white" />
            ))}
          </div>
        ) : null}

        {isError ? (
          <div className="rounded-2xl border border-line bg-white p-6 text-center">
            <p className="text-sm text-muted">Could not load brands.</p>
            <Button type="button" className="mt-3" variant="secondary" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : null}

        {!isLoading && !isError ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {items.map((brand) => (
              <Link
                key={brand._id}
                href={`/brands/${brand._id}`}
                className="flex aspect-[3/2] items-center justify-center rounded-xl border border-line bg-white p-3 transition-shadow hover:shadow-card"
              >
                {brand.image ? (
                  <img
                    src={resolveMediaUrl(brand.image)}
                    alt={brand.name}
                    loading="lazy"
                    className="max-h-12 max-w-full object-contain"
                  />
                ) : (
                  <span className="text-center text-xs font-semibold text-ink">{brand.name}</span>
                )}
              </Link>
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
}