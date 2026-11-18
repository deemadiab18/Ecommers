import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils/cn";

export default function Pagination({ page, totalPages, onChange, className }) {
  if (!totalPages || totalPages <= 1) return null;

  const items = buildPages(page, totalPages);

  return (
    <nav className={cn("flex items-center justify-center gap-1", className)} aria-label="Pagination">
      <PageButton label="Previous page" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft className="size-4" />
      </PageButton>
      {items.map((item, index) =>
        item === "…" ? (
          <span key={`gap-${index}`} className="px-2 text-sm text-muted">
            …
          </span>
        ) : (
          <PageButton
            key={item}
            active={item === page}
            label={`Page ${item}`}
            onClick={() => onChange(item)}
          >
            {item}
          </PageButton>
        ),
      )}
      <PageButton label="Next page" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        <ChevronRight className="size-4" />
      </PageButton>
    </nav>
  );
}

function PageButton({ children, onClick, disabled, active, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? "page" : undefined}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex min-w-10 items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-white"
          : "border-line bg-white text-ink hover:bg-mint disabled:opacity-40",
      )}
    >
      {children}
    </button>
  );
}

function buildPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
  if (current > 3) pages.push("…");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p += 1) pages.push(p);
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}