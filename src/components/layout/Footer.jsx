import Link from "next/link";
import { CreditCard, Leaf, MapPin } from "lucide-react";
import Container from "./Container";
import { STORE } from "../../constants/store";
import { FOOTER_COLUMNS } from "../../constants/navigation";
import { useAuth } from "../../context/AuthContext";

const PAYMENT_BADGES = ["Visa", "Mastercard", "PayPal"];

export default function Footer() {
  const { status } = useAuth();
  const signedIn = status === "authenticated";

  return (
    <footer className="mt-auto border-t border-line bg-white">
      <Container className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="inline-flex items-center gap-2 font-bold text-ink">
            <span className="flex size-9 items-center justify-center rounded-xl bg-mint text-primary">
              <Leaf className="size-5" aria-hidden />
            </span>
            {STORE.name}
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Farm-fresh groceries and everyday essentials delivered across {STORE.city}. Quality you can trust, from
            local producers to your doorstep.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>
              <a href={STORE.phoneHref} className="hover:text-primary">
                {STORE.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${STORE.email}`} className="hover:text-primary">
                {STORE.email}
              </a>
            </li>
            <li className="inline-flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
              {STORE.city}
            </li>
          </ul>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title}>
            <h2 className="text-sm font-semibold text-ink">{column.title}</h2>
            <ul className="mt-4 space-y-2">
              {column.links.map((link) => {
                if (link.protected && !signedIn) {
                  return (
                    <li key={link.label}>
                      <Link href="/login" className="text-sm text-muted hover:text-primary">
                        {link.label}
                      </Link>
                    </li>
                  );
                }
                return (
                  <li key={link.label}>
                    <Link href={link.to} className="text-sm text-muted hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-line bg-surface">
        <Container className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} {STORE.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {PAYMENT_BADGES.map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-md border border-line bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted"
              >
                <CreditCard className="size-3.5 shrink-0 text-muted" aria-hidden />
                {label}
              </span>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}