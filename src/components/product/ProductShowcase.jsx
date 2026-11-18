"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "../layout/Container";
import ProductCard from "./ProductCard";
import ProductGridSkeleton from "./ProductSkeleton";
import Button from "../ui/Button";
import { useProducts } from "../../hooks/useProducts";
import { cn } from "../../utils/cn";

export default function ProductShowcase({ title, subtitle, params, viewAllTo = "/products", className }) {
  const { data, isLoading, isError, refetch } = useProducts(params);
  const items = data?.items ?? [];

  return (
    <section className={cn("py-10", className)}>
      <Container>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-ink">{title}</h2>
            {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
          </div>
          <Link href={viewAllTo} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            View all
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        {isLoading ? <ProductGridSkeleton count={params?.limit ?? 8} /> : null}

        {isError ? (
          <div className="rounded-2xl border border-line bg-white p-8 text-center">
            <p className="text-sm text-muted">We couldn&apos;t load products.</p>
            <Button type="button" className="mt-4" variant="secondary" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        ) : null}

        {!isLoading && !isError && items.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line bg-white p-8 text-center text-sm text-muted">
            No products to show right now.
          </p>
        ) : null}

        {!isLoading && !isError && items.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
}