import { Star } from "lucide-react";
import { cn } from "../../utils/cn";

export default function RatingPicker({ value, onChange }) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-2 block text-sm font-medium text-ink">Your rating</legend>
      <div className="flex gap-1" role="radiogroup">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} stars`}
            className={cn(
              "inline-flex size-10 items-center justify-center rounded-lg border border-line transition-colors",
              value >= star ? "border-star bg-star/10 text-star" : "text-muted hover:bg-surface",
            )}
            onClick={() => onChange(star)}
          >
            <Star className={cn("size-5", value >= star && "fill-star")} />
          </button>
        ))}
      </div>
    </fieldset>
  );
}