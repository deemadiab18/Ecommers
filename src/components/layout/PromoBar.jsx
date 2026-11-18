import { Mail, Phone, Truck } from "lucide-react";
import { STORE } from "../../constants/store";
import Container from "./Container";

export default function PromoBar() {
  return (
    <div className="border-b border-line bg-mint text-sm text-ink">
      <Container className="flex flex-col gap-2 py-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 font-medium">
          <Truck className="size-4 shrink-0 text-primary" aria-hidden />
          Free shipping on orders over {STORE.freeShipping} EGP
        </p>
        <div className="flex flex-wrap items-center gap-4 text-muted">
          <a
            href={STORE.phoneHref}
            className="inline-flex items-center gap-1.5 hover:text-primary"
          >
            <Phone className="size-3.5" aria-hidden />
            {STORE.phone}
          </a>
          <a
            href={`mailto:${STORE.email}`}
            className="inline-flex items-center gap-1.5 hover:text-primary"
          >
            <Mail className="size-3.5" aria-hidden />
            {STORE.email}
          </a>
        </div>
      </Container>
    </div>
  );
}