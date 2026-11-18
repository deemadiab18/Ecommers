"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useSearchParamsState } from "../hooks/useSearchParamsState";
import { useMemo } from "react";
import Container from "../components/layout/Container";
import Spinner from "../components/ui/Spinner";
import Button from "../components/ui/Button";
import ProductGrid from "../components/product/ProductGrid";
import Pagination from "../components/ui/Pagination";
import { resolveMediaUrl } from "../utils/media";
import { useBrand } from "../hooks/useBrand";
import { useProducts } from "../hooks/useProducts";
import { PRODUCT_PAGE_SIZE } from "../utils/productParams";

export default function BrandDetailsPage() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParamsState();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const { data: brand, isLoading, isError, refetch } = useBrand(id);

  const productParams = useMemo(
    () => ({ limit: PRODUCT_PAGE_SIZE, page, brand: id }),
    [id, page],
  );
  const productsQuery = useProducts(productParams, { enabled: Boolean(id) });

  function goToPage(nextPage) {
    const next = new URLSearchParams(searchParams);
    if (nextPage <= 1) next.delete("page");
    else next.set("page", String(nextPage));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (isLoading) {
    return (
      <Container className="flex min-h-[40vh] items-center justify-center py-16">
        <Spinner label="Loading brand…" />
      </Container>
    );
  }

  if (isError || !brand) {
    return (
      <Container className="py-16 text-center">
        <h1 className="text-xl font-semibold text-ink">Brand not found</h1>
        <Link href="/brands" className="mt-4 inline-block">
          <Button variant="secondary">Back to brands</Button>
        </Link>
      </Container>
    );
  }

  const items = productsQuery.data?.items ?? [];
  const totalPages = productsQuery.data?.metadata?.numberOfPages ?? 0;

  return (
    <Container className="py-10">
      <nav className="mb-6 text-sm text-muted">
        <Link href="/brands" className="hover:text-primary">
          Brands
        </Link>
        <span className="mx-2">/</span>
        <span>{brand.name}</span>
      </nav>

      <header className="mb-10 flex flex-col items-center gap-4 rounded-2xl border border-line bg-white p-8 text-center shadow-card sm:flex-row sm:text-left">
        {brand.image ? (
          <img src={resolveMediaUrl(brand.image)} alt={brand.name} className="h-20 max-w-[12rem] object-contain" />
        ) : null}
        <div>
          <h1 className="text-3xl font-bold text-ink">{brand.name}</h1>
          <p className="mt-2 text-sm text-muted">
            {productsQuery.data?.results ?? 0} products from {brand.name}
          </p>
        </div>
      </header>

      <ProductGrid
        items={items}
        isLoading={productsQuery.isLoading}
        isError={productsQuery.isError}
        onRetry={() => productsQuery.refetch()}
        emptyTitle="No products for this brand"
      />
      <Pagination className="mt-8" page={page} totalPages={totalPages} onChange={goToPage} />
    </Container>
  );
}