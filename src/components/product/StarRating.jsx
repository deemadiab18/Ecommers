import { Star } from "lucide-react";
import { cn } from "../../utils/cn";

export default function StarRating({ value = 0, count, className, size = "sm" }) {
  const rating = Number(value) || 0;
  const sizes = { sm: "size-3.5", md: "size-4" };

  return (
    <div className={cn("inline-flex items-center gap-1 text-sm", className)}>
      <Star className={cn(sizes[size], "fill-star text-star")} aria-hidden />
      <span className="font-medium text-ink">{rating.toFixed(1)}</span>
      {count != null ? <span className="text-muted">({count})</span> : null}
    </div>
  );
}