import { cn } from "../../utils/cn";

export default function PriceTag({ price, priceAfterDiscount, className }) {
  const onSale = priceAfterDiscount != null && priceAfterDiscount < price;
  const amount = onSale ? priceAfterDiscount : price;

  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span className="text-lg font-bold text-ink">{formatEgp(amount)}</span>
      {onSale ? <span className="text-sm text-muted line-through">{formatEgp(price)}</span> : null}
    </div>
  );
}

function formatEgp(value) {
  const n = Number(value) || 0;
  return `${n.toLocaleString("en-EG")} EGP`;
}