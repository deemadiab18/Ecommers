"use client";

import { useRouter } from "next/navigation";
import { Heart, ShoppingBag } from "lucide-react";
import Container from "../components/layout/Container";
import CatalogPageHeader from "../components/catalog/CatalogPageHeader";
import ProductCard from "../components/product/ProductCard";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import { useWishlistSummary } from "../hooks/useWishlist";
import { useMoveWishlistToCart, useRemoveFromWishlist } from "../hooks/useWishlistActions";

export default function WishlistPage() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useWishlistSummary();
  const remove = useRemoveFromWishlist();
  const moveToCart = useMoveWishlistToCart();

  const items = data?.items ?? [];

  if (isLoading) {
    return (
      <Container className="py-10">
        <CatalogPageHeader title="Wishlist" subtitle="Loading saved products…" />
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner />
        </div>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container className="py-10">
        <CatalogPageHeader title="Wishlist" subtitle="Saved products you want to buy later." />
        <div className="rounded-2xl border border-line bg-white p-8 text-center">
          <p className="text-sm text-muted">Could not load your wishlist.</p>
          <Button type="button" className="mt-4" variant="secondary" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      </Container>
    );
  }

  if (!items.length) {
    return (
      <Container className="py-10">
        <CatalogPageHeader title="Wishlist" subtitle="Save products with the heart icon anywhere in the store." />
        <EmptyState
          title="No saved products yet"
          description="Tap the heart on any product to add it here."
          actionLabel="Browse products"
          onAction={() => router.push("/products")}
        />
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <CatalogPageHeader
        title="Wishlist"
        subtitle={`${data?.count ?? items.length} saved product${items.length === 1 ? "" : "s"}`}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((product) => {
          const outOfStock = product.quantity === 0;
          const busy =
            (remove.isPending && remove.variables === product._id) ||
            (moveToCart.isPending && moveToCart.variables === product._id);

          return (
            <div key={product._id} className="flex flex-col gap-2">
              <ProductCard product={product} />
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="secondary"
                  className="h-9 flex-1 gap-1.5 text-xs"
                  disabled={outOfStock || busy}
                  loading={moveToCart.isPending && moveToCart.variables === product._id}
                  onClick={() => moveToCart.mutate(product._id)}
                >
                  <ShoppingBag className="size-3.5" aria-hidden />
                  Move to cart
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-9 flex-1 gap-1.5 text-xs text-discount"
                  disabled={busy}
                  loading={remove.isPending && remove.variables === product._id}
                  onClick={() => remove.mutate(product._id)}
                >
                  <Heart className="size-3.5" aria-hidden />
                  Remove
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}