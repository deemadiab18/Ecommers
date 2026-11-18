"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Heart, ShoppingBag } from "lucide-react";
import ProductImage from "./ProductImage";
import StarRating from "./StarRating";
import PriceTag from "./PriceTag";
import Button from "../ui/Button";
import { cn } from "../../utils/cn";
import { useAuth } from "../../context/AuthContext";
import { useAddToCart } from "../../hooks/useCartActions";
import { useToggleWishlist, useWishlistProductIds } from "../../hooks/useWishlistActions";
import toast from "react-hot-toast";
import { loginHref } from "../../utils/navigation";

export default function ProductCard({ product, className }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { status } = useAuth();
  const signedIn = status === "authenticated";
  const wishlistIds = useWishlistProductIds();
  const addToCart = useAddToCart();
  const toggleWishlist = useToggleWishlist();

  const saved = wishlistIds.has(product._id);
  const outOfStock = product.quantity === 0;

  function requireAuth() {
    toast.error("Sign in to continue");
    const query = searchParams.toString();
    router.push(loginHref(`${pathname}${query ? `?${query}` : ""}`));
  }

  function handleWishlist(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!signedIn) return requireAuth();
    toggleWishlist.mutate(product._id);
  }

  function handleAddToCart(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!signedIn) return requireAuth();
    if (outOfStock) return toast.error("This item is out of stock");
    addToCart.mutate(product._id);
  }

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-2xl border border-line bg-white p-3 shadow-card transition-shadow hover:shadow-lg",
        className,
      )}
    >
      <Link href={`/products/${product._id}`} className="block flex-1">
        <div className="relative overflow-hidden rounded-xl bg-surface">
          <ProductImage src={product.imageCover} alt={product.title} className="transition-transform group-hover:scale-[1.02]" />
          <button
            type="button"
            className={cn(
              "absolute right-2 top-2 flex size-9 items-center justify-center rounded-full border border-line bg-white/95 shadow-sm transition-colors",
              saved ? "text-discount" : "text-muted hover:text-discount",
            )}
            aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={saved}
            onClick={handleWishlist}
            disabled={toggleWishlist.isPending}
          >
            <Heart className={cn("size-4", saved && "fill-discount")} />
          </button>
          {product.priceAfterDiscount != null && product.priceAfterDiscount < product.price ? (
            <span className="absolute left-2 top-2 rounded-full bg-discount px-2 py-0.5 text-[10px] font-bold uppercase text-white">
              Sale
            </span>
          ) : null}
        </div>
        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-primary">
          {product.category?.name ?? "Product"}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-ink">{product.title}</h3>
        <div className="mt-2">
          <StarRating value={product.ratingsAverage} count={product.ratingsQuantity} />
        </div>
        <PriceTag className="mt-2" price={product.price} priceAfterDiscount={product.priceAfterDiscount} />
      </Link>
      <Button
        type="button"
        className="mt-3 h-10 w-full gap-2 text-sm"
        variant="secondary"
        disabled={outOfStock || addToCart.isPending}
        onClick={handleAddToCart}
      >
        <ShoppingBag className="size-4" aria-hidden />
        {outOfStock ? "Out of stock" : "Add to cart"}
      </Button>
    </article>
  );
}