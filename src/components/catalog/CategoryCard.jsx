import Link from "next/link";
import { resolveMediaUrl } from "../../utils/media";

export default function CategoryCard({ category }) {
  return (
    <Link
      href={`/categories/${category._id}`}
      className="group overflow-hidden rounded-2xl border border-line bg-white shadow-card transition-shadow hover:shadow-lg"
    >
      <div className="aspect-[4/3] overflow-hidden bg-surface">
        {category.image ? (
          <img
            src={resolveMediaUrl(category.image)}
            alt={category.name}
            loading="lazy"
            className="size-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-sm text-muted">No image</div>
        )}
      </div>
      <p className="px-4 py-3 text-sm font-semibold text-ink">{category.name}</p>
    </Link>
  );
}