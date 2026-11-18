"use client";

import { useSearchParamsState } from "../hooks/useSearchParamsState";
import { useMemo } from "react";
import Container from "../components/layout/Container";
import CatalogPageHeader from "../components/catalog/CatalogPageHeader";
import ProductsFilters from "../components/product/ProductsFilters";
import ProductGrid from "../components/product/ProductGrid";
import Pagination from "../components/ui/Pagination";
import { useProducts } from "../hooks/useProducts";
import {
  applyFilterPatch,
  readProductFilters,
  toProductApiParams,
} from "../utils/productParams";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParamsState();
  const filters = useMemo(() => readProductFilters(searchParams), [searchParams]);
  const apiParams = useMemo(() => toProductApiParams(filters), [filters]);
  const { data, isLoading, isError, refetch, isFetching } = useProducts(apiParams);

  const items = data?.items ?? [];
  const totalPages = data?.metadata?.numberOfPages ?? 0;
  const page = data?.metadata?.currentPage ?? filters.page;

  function updateFilters(patch) {
    setSearchParams(applyFilterPatch(searchParams, patch), { replace: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function clearFilters() {
    setSearchParams({}, { replace: false });
  }

  return (
    <Container className="py-10">
      <CatalogPageHeader
        title="Shop"
        subtitle={
          data?.results != null
            ? `${data.results} products${filters.keyword ? ` matching "${filters.keyword}"` : ""}`
            : "Browse the full FreshCart catalog."
        }
      />

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <ProductsFilters filters={filters} onApply={updateFilters} onClear={clearFilters} />
        <div className="space-y-6">
          {isFetching && !isLoading ? (
            <p className="text-xs font-medium uppercase tracking-wide text-primary">Updating…</p>
          ) : null}
          <ProductGrid
            items={items}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
            onClear={clearFilters}
          />
          <Pagination page={page} totalPages={totalPages} onChange={(next) => updateFilters({ page: next })} />
        </div>
      </div>
    </Container>
  );
}