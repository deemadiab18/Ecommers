"use client";

import { useSearchParamsState } from "../hooks/useSearchParamsState";
import { useEffect, useState } from "react";
import Container from "../components/layout/Container";
import CatalogPageHeader from "../components/catalog/CatalogPageHeader";
import BrandCard from "../components/catalog/BrandCard";
import Pagination from "../components/ui/Pagination";
import TextField from "../components/ui/TextField";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { useBrands } from "../hooks/useBrands";

const LIMIT = 12;

export default function BrandsPage() {
  const [searchParams, setSearchParams] = useSearchParamsState();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const keywordParam = searchParams.get("keyword") || "";
  const [keyword, setKeyword] = useState(keywordParam);

  useEffect(() => setKeyword(keywordParam), [keywordParam]);

  const { data, isLoading, isError, refetch } = useBrands({
    limit: LIMIT,
    page,
    keyword: keywordParam || undefined,
  });

  const items = data?.items ?? [];
  const totalPages = data?.metadata?.numberOfPages ?? 0;

  function submitSearch(event) {
    event.preventDefault();
    const next = new URLSearchParams();
    if (keyword.trim()) next.set("keyword", keyword.trim());
    setSearchParams(next);
  }

  function goToPage(nextPage) {
    const next = new URLSearchParams(searchParams);
    if (nextPage <= 1) next.delete("page");
    else next.set("page", String(nextPage));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <Container className="py-10">
      <CatalogPageHeader
        title="Brands"
        subtitle={data?.results != null ? `${data.results} brands` : "Shop your favourite labels."}
      />

      <form onSubmit={submitSearch} className="mb-8 flex max-w-md flex-col gap-2 sm:flex-row">
        <TextField
          id="brand-search"
          placeholder="Search brands…"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          className="flex-1"
        />
        <Button type="submit" className="shrink-0">
          Search
        </Button>
      </form>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-surface" />
          ))}
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-2xl border border-line bg-white p-8 text-center">
          <p className="text-sm text-muted">Could not load brands.</p>
          <Button type="button" className="mt-4" variant="secondary" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : null}

      {!isLoading && !isError && items.length === 0 ? (
        <EmptyState title="No brands found" description="Try another search term." />
      ) : null}

      {!isLoading && !isError && items.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((brand) => (
            <BrandCard key={brand._id} brand={brand} />
          ))}
        </div>
      ) : null}

      <Pagination className="mt-8" page={page} totalPages={totalPages} onChange={goToPage} />
    </Container>
  );
}