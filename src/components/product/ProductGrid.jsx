import ProductCard from "./ProductCard";
import ProductGridSkeleton from "./ProductSkeleton";
import EmptyState from "../ui/EmptyState";
import Button from "../ui/Button";

export default function ProductGrid({
  items,
  isLoading,
  isError,
  onRetry,
  emptyTitle = "No products found",
  emptyDescription = "Try changing your filters or search term.",
  onClear,
}) {
  if (isLoading) return <ProductGridSkeleton count={12} />;

  if (isError) {
    return (
      <div className="rounded-2xl border border-line bg-white p-8 text-center">
        <p className="text-sm text-muted">Could not load products.</p>
        <Button type="button" className="mt-4" variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      </div>
    );
  }

  if (!items.length) {
    return (
      <EmptyState title={emptyTitle} description={emptyDescription} actionLabel={onClear ? "Clear filters" : undefined} onAction={onClear} />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {items.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}