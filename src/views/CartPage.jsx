"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShoppingBag, Tag } from "lucide-react";
import Container from "../components/layout/Container";
import CatalogPageHeader from "../components/catalog/CatalogPageHeader";
import CartLineItem from "../components/cart/CartLineItem";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import TextField from "../components/ui/TextField";
import Spinner from "../components/ui/Spinner";
import { COUPON_ENABLED } from "../api/cart";
import { useCartSummary } from "../hooks/useCart";
import { useApplyCoupon, useClearCart } from "../hooks/useCartActions";

function formatEgp(value) {
  return `${(Number(value) || 0).toLocaleString("en-EG")} EGP`;
}

export default function CartPage() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useCartSummary();
  const clearCart = useClearCart();
  const applyCoupon = useApplyCoupon();
  const [coupon, setCoupon] = useState("");

  const lines = data?.products ?? [];
  const isEmpty = !isLoading && lines.length === 0;
  const cartId = data?.cartId;

  function submitCoupon(event) {
    event.preventDefault();
    const name = coupon.trim();
    if (!name) return;
    applyCoupon.mutate(name, { onSuccess: () => setCoupon("") });
  }

  if (isLoading) {
    return (
      <Container className="flex min-h-[50vh] items-center justify-center py-12">
        <Spinner />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container className="py-12">
        <div className="rounded-2xl border border-line bg-white p-8 text-center">
          <p className="text-sm text-muted">Could not load your cart.</p>
          <Button type="button" className="mt-4" variant="secondary" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <CatalogPageHeader
        title="Your cart"
        subtitle={
          isEmpty
            ? "Your cart is empty — start shopping to fill it up."
            : `${data?.numOfCartItems ?? lines.length} item${lines.length === 1 ? "" : "s"} ready for checkout`
        }
      />

      {isEmpty ? (
        <EmptyState
          title="Your cart is empty"
          description="Browse products and add your favourites."
          actionLabel="Go to shop"
          onAction={() => router.push("/products")}
        />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Items</h2>
              <Button
                type="button"
                variant="ghost"
                className="h-9 px-3 text-xs"
                loading={clearCart.isPending}
                onClick={() => clearCart.mutate()}
              >
                Clear cart
              </Button>
            </div>
            <ul className="space-y-3">
              {lines.map((line) => (
                <CartLineItem key={line.product?._id ?? line._id} line={line} />
              ))}
            </ul>
          </div>

          <aside className="h-fit space-y-4 rounded-2xl border border-line bg-white p-6 shadow-card">
            <h2 className="text-lg font-bold text-ink">Order summary</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between text-muted">
                <dt>Subtotal</dt>
                <dd className="font-medium text-ink">{formatEgp(data?.totalCartPrice)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-base font-bold text-ink">
                <dt>Total</dt>
                <dd>{formatEgp(data?.totalCartPrice)}</dd>
              </div>
            </dl>

            {COUPON_ENABLED ? (
              <form onSubmit={submitCoupon} className="space-y-3 border-t border-line pt-4">
                <p className="flex items-center gap-2 text-sm font-medium text-ink">
                  <Tag className="size-4 text-primary" aria-hidden />
                  Coupon code
                </p>
                <div className="flex gap-2">
                  <TextField
                    id="cart-coupon"
                    placeholder="Enter code"
                    value={coupon}
                    onChange={(event) => setCoupon(event.target.value)}
                    className="flex-1"
                    inputClassName="h-10"
                  />
                  <Button type="submit" variant="secondary" className="h-10 shrink-0 px-4" loading={applyCoupon.isPending}>
                    Apply
                  </Button>
                </div>
              </form>
            ) : null}

            {cartId ? (
              <Link href={`/checkout/${cartId}`} className="block">
                <Button type="button" className="w-full gap-2">
                  <ShoppingBag className="size-4" aria-hidden />
                  Proceed to checkout
                </Button>
              </Link>
            ) : (
              <Button type="button" className="w-full" disabled title="Cart id is not available yet">
                Proceed to checkout
              </Button>
            )}

            <Link href="/products" className="block text-center text-sm font-medium text-primary hover:underline">
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </Container>
  );
}