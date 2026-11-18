"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import ProductImage from "../product/ProductImage";
import PriceTag from "../product/PriceTag";
import QuantityStepper from "../product/QuantityStepper";
import { useRemoveCartItem, useUpdateCartItem } from "../../hooks/useCartActions";

export default function CartLineItem({ line }) {
  const product = line.product ?? {};
  const productId = product._id;
  const maxQty = Math.max(1, Number(product.quantity) || 99);
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const busy = updateItem.isPending || removeItem.isPending;

  function handleQuantity(next) {
    if (next === line.count) return;
    updateItem.mutate({ productId, count: next });
  }

  return (
    <li className="flex gap-4 rounded-2xl border border-line bg-white p-4 shadow-card sm:gap-6">
      <Link
        href={productId ? `/products/${productId}` : "#"}
        className="block w-24 shrink-0 overflow-hidden rounded-xl bg-surface sm:w-28"
      >
        <ProductImage src={product.imageCover} alt={product.title ?? "Product"} />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          {product.category?.name ? (
            <p className="text-xs font-medium uppercase tracking-wide text-primary">{product.category.name}</p>
          ) : null}
          <Link href={productId ? `/products/${productId}` : "#"} className="mt-0.5 block">
            <h2 className="line-clamp-2 text-sm font-semibold text-ink hover:text-primary sm:text-base">
              {product.title ?? "Product"}
            </h2>
          </Link>
          <PriceTag className="mt-2" price={line.price} priceAfterDiscount={product.priceAfterDiscount} />
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <QuantityStepper
            value={line.count}
            min={1}
            max={maxQty}
            onChange={handleQuantity}
            className={busy ? "pointer-events-none opacity-60" : undefined}
          />
          <p className="min-w-[5.5rem] text-right text-sm font-bold text-ink">
            {(Number(line.price) * line.count).toLocaleString("en-EG")} EGP
          </p>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-xl text-muted transition-colors hover:bg-surface hover:text-discount disabled:opacity-40"
            aria-label="Remove item"
            disabled={removeItem.isPending}
            onClick={() => removeItem.mutate(productId)}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </li>
  );
}