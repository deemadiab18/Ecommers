import Link from "next/link";
import { MapPin } from "lucide-react";
import Badge from "../ui/Badge";
import ProductImage from "../product/ProductImage";
import { cn } from "../../utils/cn";

function formatEgp(value) {
  return `${(Number(value) || 0).toLocaleString("en-EG")} EGP`;
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-EG", { dateStyle: "medium", timeStyle: "short" });
}

function paymentLabel(type) {
  if (type === "card") return "Paid online";
  return "Cash on delivery";
}

export default function OrderCard({ order }) {
  const items = order.cartItems ?? [];
  const address = order.shippingAddress;

  return (
    <article className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Order</p>
          <p className="mt-0.5 font-mono text-sm font-semibold text-ink">#{String(order.id ?? order._id).slice(-8)}</p>
          <p className="mt-1 text-sm text-muted">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Badge variant="muted">{paymentLabel(order.paymentMethodType)}</Badge>
          <Badge className={cn(order.isPaid ? "bg-mint text-primary" : "bg-amber-50 text-amber-800")}>
            {order.isPaid ? "Paid" : "Unpaid"}
          </Badge>
          <Badge className={cn(order.isDelivered ? "bg-mint text-primary" : "bg-surface text-muted")}>
            {order.isDelivered ? "Delivered" : "In progress"}
          </Badge>
        </div>
      </header>

      {address ? (
        <p className="mt-4 flex items-start gap-2 text-sm text-muted">
          <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
          <span>
            {address.details}, {address.city}
            {address.phone ? ` · ${address.phone}` : ""}
          </span>
        </p>
      ) : null}

      <ul className="mt-4 space-y-3">
        {items.map((line) => {
          const product = typeof line.product === "object" ? line.product : null;
          const productId = product?._id ?? line.product;
          const title = product?.title ?? "Product";
          return (
            <li key={line._id ?? `${productId}-${line.count}`} className="flex gap-3">
              <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-surface">
                {product?.imageCover ? (
                  <ProductImage src={product.imageCover} alt={title} />
                ) : (
                  <div className="flex size-full items-center justify-center text-xs text-muted">Item</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                {productId ? (
                  <Link href={`/products/${productId}`} className="text-sm font-semibold text-ink hover:text-primary">
                    {title}
                  </Link>
                ) : (
                  <p className="text-sm font-semibold text-ink">{title}</p>
                )}
                <p className="mt-0.5 text-xs text-muted">
                  Qty {line.count} × {formatEgp(line.price)}
                </p>
              </div>
              <p className="text-sm font-semibold text-ink">{formatEgp(Number(line.price) * line.count)}</p>
            </li>
          );
        })}
      </ul>

      <dl className="mt-4 space-y-1 border-t border-line pt-4 text-sm">
        {order.shippingPrice != null ? (
          <div className="flex justify-between text-muted">
            <dt>Shipping</dt>
            <dd>{formatEgp(order.shippingPrice)}</dd>
          </div>
        ) : null}
        {order.taxPrice != null ? (
          <div className="flex justify-between text-muted">
            <dt>Tax</dt>
            <dd>{formatEgp(order.taxPrice)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between pt-1 text-base font-bold text-ink">
          <dt>Total</dt>
          <dd>{formatEgp(order.totalOrderPrice)}</dd>
        </div>
      </dl>
    </article>
  );
}