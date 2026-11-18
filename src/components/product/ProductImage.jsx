"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import { resolveMediaUrl } from "../../utils/media";
import { cn } from "../../utils/cn";

export default function ProductImage({ src, alt, className }) {
  const [failed, setFailed] = useState(false);
  const url = resolveMediaUrl(src);

  if (!url || failed) {
    return (
      <div
        className={cn(
          "flex aspect-square w-full items-center justify-center bg-surface text-muted",
          className,
        )}
      >
        <ImageOff className="size-8" aria-hidden />
        <span className="sr-only">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={cn("aspect-square w-full object-cover", className)}
      onError={() => setFailed(true)}
    />
  );
}