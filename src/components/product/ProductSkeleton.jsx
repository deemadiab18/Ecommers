export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-line bg-white p-3 shadow-card">
      <div className="aspect-square w-full rounded-xl bg-surface" />
      <div className="mt-3 h-3 w-1/3 rounded bg-surface" />
      <div className="mt-2 h-4 w-full rounded bg-surface" />
      <div className="mt-2 h-3 w-1/4 rounded bg-surface" />
      <div className="mt-4 h-10 w-full rounded-xl bg-surface" />
    </div>
  );
}

export default function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}