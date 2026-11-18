import { Minus, Plus } from "lucide-react";
import { cn } from "../../utils/cn";

export default function QuantityStepper({ value, min = 1, max = 99, onChange, className }) {
  function set(next) {
    onChange(Math.min(max, Math.max(min, next)));
  }

  return (
    <div className={cn("inline-flex items-center rounded-xl border border-line bg-white", className)}>
      <button
        type="button"
        className="inline-flex size-10 items-center justify-center rounded-l-xl hover:bg-surface disabled:opacity-40"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => set(value - 1)}
      >
        <Minus className="size-4" />
      </button>
      <span className="min-w-10 px-2 text-center text-sm font-semibold text-ink" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="inline-flex size-10 items-center justify-center rounded-r-xl hover:bg-surface disabled:opacity-40"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => set(value + 1)}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}