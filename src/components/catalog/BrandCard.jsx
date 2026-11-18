import Link from "next/link";
import { resolveMediaUrl } from "../../utils/media";

export default function BrandCard({ brand }) {
  return (
    <Link
      href={`/brands/${brand._id}`}
      className="flex flex-col items-center justify-center rounded-2xl border border-line bg-white p-4 shadow-card transition-shadow hover:shadow-lg"
    >
      <div className="flex aspect-[3/2] w-full items-center justify-center">
        {brand.image ? (
          <img
            src={resolveMediaUrl(brand.image)}
            alt={brand.name}
            loading="lazy"
            className="max-h-16 max-w-full object-contain"
          />
        ) : (
          <span className="text-center text-sm font-semibold text-ink">{brand.name}</span>
        )}
      </div>
      <p className="mt-3 text-sm font-semibold text-ink">{brand.name}</p>
    </Link>
  );
}