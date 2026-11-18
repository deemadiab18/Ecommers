"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams, useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import Container from "../components/layout/Container";
import Spinner from "../components/ui/Spinner";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import ProductGallery from "../components/product/ProductGallery";
import StarRating from "../components/product/StarRating";
import PriceTag from "../components/product/PriceTag";
import QuantityStepper from "../components/product/QuantityStepper";
import ProductGrid from "../components/product/ProductGrid";
import ProductReviews from "../components/product/ProductReviews";
import { useProduct } from "../hooks/useProduct";
import { useProducts } from "../hooks/useProducts";
import { useAuth } from "../context/AuthContext";
import { useAddToCartWithCount } from "../hooks/useCartActions";
import { useToggleWishlist, useWishlistProductIds } from "../hooks/useWishlistActions";
import { cn } from "../utils/cn";
import { loginHref } from "../utils/navigation";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { data: product, isLoading, isError, refetch } = useProduct(id);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { status } = useAuth();
  const signedIn = status === "authenticated";
  const [quantity, setQuantity] = useState(1);

  const relatedParams = useMemo(
    () => (product?.category?._id ? { limit: 8, page: 1, "category[in]": product.category._id } : null),
    [product?.category?._id],
  );
  const relatedQuery = useProducts(relatedParams ?? { limit: 0, page: 1 }, { enabled: Boolean(relatedParams) });
  const relatedItems = (relatedQuery.data?.items ?? []).filter((item) => item._id !== id).slice(0, 4);

  const wishlistIds = useWishlistProductIds();
  const toggleWishlist = useToggleWishlist();
  const addToCart = useAddToCartWithCount();

  if (isLoading) {
    return (
      <Container className="flex min-h-[50vh] items-center justify-center py-16">
        <Spinner label="Loading product…" />
      </Container>
    );
  }

  if (isError || !product) {
    return (
      <Container className="py-16 text-center">
        <h1 className="text-xl font-semibold text-ink">Product not found</h1>
        <p className="mt-2 text-sm text-muted">This item may have been removed.</p>
        <div className="mt-4 flex justify-center gap-2">
          <Button type="button" variant="secondary" onClick={() => refetch()}>
            Retry
          </Button>
          <Link href="/products">
            <Button>Back to shop</Button>
          </Link>
        </div>
      </Container>
    );
  }

  const saved = wishlistIds.has(product._id);
  const inStock = product.quantity > 0;
  const maxQty = Math.min(product.quantity, 99);

  function requireAuth() {
    toast.error("Sign in to continue");
    const query = searchParams.toString();
    router.push(loginHref(`${pathname}${query ? `?${query}` : ""}`));
  }

  function handleWishlist() {
    if (!signedIn) return requireAuth();
    toggleWishlist.mutate(product._id);
  }

  function handleAdd() {
    if (!signedIn) return requireAuth();
    if (!inStock) return toast.error("This item is out of stock");
    addToCart.mutate({ productId: product._id, count: quantity });
  }

  return (
    <Container className="py-10">
      <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/products" className="hover:text-primary">
          Shop
        </Link>
        <span className="mx-2">/</span>
        {product.category?._id ? (
          <Link href={`/products?category=${product.category._id}`} className="hover:text-primary">
            {product.category.name}
          </Link>
        ) : (
          <span>Product</span>
        )}
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery cover={product.imageCover} images={product.images} title={product.title} />

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {product.category?.name}
            {product.brand?.name ? ` · ${product.brand.name}` : ""}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-ink">{product.title}</h1>
          <div className="mt-3">
            <StarRating value={product.ratingsAverage} count={product.ratingsQuantity} size="md" />
          </div>
          <PriceTag className="mt-4" price={product.price} priceAfterDiscount={product.priceAfterDiscount} />

          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted">{product.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant={inStock ? "default" : "sale"}>{inStock ? `${product.quantity} in stock` : "Out of stock"}</Badge>
            {product.sold != null ? <Badge variant="muted">{product.sold.toLocaleString()} sold</Badge> : null}
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            {product.category?._id ? (
              <Link href={`/categories/${product.category._id}`} className="font-medium text-primary hover:underline">
                Category: {product.category.name}
              </Link>
            ) : null}
            {product.brand?._id ? (
              <Link href={`/brands/${product.brand._id}`} className="font-medium text-primary hover:underline">
                Brand: {product.brand.name}
              </Link>
            ) : null}
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <QuantityStepper value={quantity} max={maxQty} onChange={setQuantity} />
            <div className="flex flex-1 flex-wrap gap-2">
              <Button
                type="button"
                className="min-w-[10rem] flex-1 gap-2"
                disabled={!inStock || addToCart.isPending}
                loading={addToCart.isPending}
                onClick={handleAdd}
              >
                <ShoppingBag className="size-4" aria-hidden />
                Add to cart
              </Button>
              <Button
                type="button"
                variant="secondary"
                className={cn("gap-2", saved && "border-discount text-discount")}
                aria-pressed={saved}
                disabled={toggleWishlist.isPending}
                onClick={handleWishlist}
              >
                <Heart className={cn("size-4", saved && "fill-discount")} aria-hidden />
                {saved ? "Saved" : "Wishlist"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14 border-t border-line pt-10">
        <ProductReviews productId={product._id} />
      </div>

      {relatedItems.length > 0 ? (
        <div className="mt-14 border-t border-line pt-10">
          <h2 className="text-xl font-bold text-ink">Related products</h2>
          <p className="mt-1 text-sm text-muted">More from {product.category?.name}</p>
          <div className="mt-6">
            <ProductGrid
              items={relatedItems}
              isLoading={relatedQuery.isLoading}
              isError={relatedQuery.isError}
              onRetry={() => relatedQuery.refetch()}
            />
          </div>
        </div>
      ) : null}
    </Container>
  );
}