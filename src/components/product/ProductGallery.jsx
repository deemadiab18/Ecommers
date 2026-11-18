"use client";

import { useState } from "react";
import ProductImage from "./ProductImage";
import { resolveMediaUrl } from "../../utils/media";
import { cn } from "../../utils/cn";

export default function ProductGallery({ cover, images = [], title }) {
  const gallery = [cover, ...(images || [])]
    .filter(Boolean)
    .map((src) => resolveMediaUrl(src))
    .filter((url, index, list) => list.indexOf(url) === index);
  const [active, setActive] = useState(0);
  const main = gallery[active] || gallery[0];

  return (
    <div className="space-y-3">
      <ProductImage src={main} alt={title} className="rounded-2xl" />
      {gallery.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {gallery.map((url, index) => (
            <button
              key={url}
              type="button"
              className={cn(
                "h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2",
                index === active ? "border-primary" : "border-transparent",
              )}
              aria-label={`Show image ${index + 1}`}
              aria-pressed={index === active}
              onClick={() => setActive(index)}
            >
              <img src={url} alt="" loading="lazy" className="size-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}