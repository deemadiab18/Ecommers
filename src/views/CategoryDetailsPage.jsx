"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useSearchParamsState } from "../hooks/useSearchParamsState";
import { useMemo, useState } from "react";
import Container from "../components/layout/Container";
import Spinner from "../components/ui/Spinner";
import Button from "../components/ui/Button";
import ProductGrid from "../components/product/ProductGrid";
import Pagination from "../components/ui/Pagination";
import { resolveMediaUrl } from "../utils/media";
import { useCategory, useCategorySubcategories } from "../hooks/useCategory";
import { useProducts } from "../hooks/useProducts";
import { PRODUCT_PAGE_SIZE } from "../utils/productParams";
import { cn } from "../utils/cn";

export default function CategoryDetailsPage() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParamsState();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const [subcategoryId, setSubcategoryId] = useState(null);

  const { data: category, isLoading, isError } = useCategory(id);
  const subcategoriesQuery = useCategorySubcategories(id);

  const productParams = useMemo(
    () => ({ limit: PRODUCT_PAGE_SIZE, page, "category[in]": id }),
    [id, page],
  );
  const productsQuery = useProducts(productParams, { enabled: Boolean(id) });

  const rawItems = productsQuery.data?.items ?? [];
  const items = subcategoryId
    ? rawItems.filter((product) =>
        (product.subcategory ?? []).some((sub) => sub._id === subcategoryId),
      )
    : rawItems;

  const totalPages = subcategoryId ? 1 : productsQuery.data?.metadata?.numberOfPages ?? 0;

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
        <Spinner label="Loading category…" />
      </Container>
    );
  }

  if (isError || !category) {
    return (
      <Container className="py-16 text-center">
        <h1 className="text-xl font-semibold text-ink">Category not found</h1>
        <Link href="/categories" className="mt-4 inline-block">
          <Button variant="secondary">Back to categories</Button>
        </Link>
      </Container>
    );
  }

  const subcategories = subcategoriesQuery.data?.items ?? [];

  return (
    <Container className="py-10">
      <nav className="mb-6 text-sm text-muted">
        <Link href="/categories" className="hover:text-primary">
          Categories
        </Link>
        <span className="mx-2">/</span>
        <span>{category.name}</span>
      </nav>

      <header className="mb-8 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        {category.image ? (
          <img
            src={resolveMediaUrl(category.image)}
            alt=""
            className="h-40 w-full object-cover sm:h-52"
          />
        ) : null}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-ink">{category.name}</h1>
          <p className="mt-2 text-sm text-muted">
            {productsQuery.data?.results ?? 0} products in this category
          </p>
        </div>
      </header>

      {subcategories.length > 0 ? (
        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold text-ink">Subcategories</p>
          <div className="flex flex-wrap gap-2">
            <Chip active={!subcategoryId} onClick={() => setSubcategoryId(null)}>
              All
            </Chip>
            {subcategories.map((sub) => (
              <Chip key={sub._id} active={subcategoryId === sub._id} onClick={() => setSubcategoryId(sub._id)}>
                {sub.name}
              </Chip>
            ))}
          </div>
          {subcategoryId ? (
            <p className="mt-2 text-xs text-muted">Filtering the current page by subcategory (pagination disabled).</p>
          ) : null}
        </div>
      ) : null}

      <ProductGrid
        items={items}
        isLoading={productsQuery.isLoading}
        isError={productsQuery.isError}
        onRetry={() => productsQuery.refetch()}
        emptyTitle="No products in this category"
      />

      {!subcategoryId ? (
        <Pagination className="mt-8" page={page} totalPages={totalPages} onChange={goToPage} />
      ) : null}
    </Container>
  );
}

function Chip({ children, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
        active ? "border-primary bg-mint text-primary" : "border-line bg-white text-ink hover:bg-surface",
      )}
    >
      {children}
    </button>
  );
}