import Link from "next/link";
import { Percent, Sparkles } from "lucide-react";
import Container from "../layout/Container";
import Button from "../ui/Button";
import { STORE } from "../../constants/store";

export default function PromoBanners() {
  return (
    <section className="bg-white py-10">
      <Container className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col justify-between rounded-2xl border border-line bg-gradient-to-br from-mint to-white p-6 shadow-card sm:p-8">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <Percent className="size-4" aria-hidden />
              Weekly deals
            </span>
            <h3 className="mt-3 text-xl font-bold text-ink">Save on household essentials</h3>
            <p className="mt-2 text-sm text-muted">
              Stock up on pantry favourites and get free delivery over {STORE.freeShipping} EGP.
            </p>
          </div>
          <Link href="/products" className="mt-6">
            <Button>Shop deals</Button>
          </Link>
        </div>
        <div className="flex flex-col justify-between rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-mint to-white p-6 shadow-card sm:p-8">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <Sparkles className="size-4" aria-hidden />
              New arrivals
            </span>
            <h3 className="mt-3 text-xl font-bold text-ink">Fresh picks landed today</h3>
            <p className="mt-2 text-sm text-muted">Explore the latest products added to the FreshCart catalog.</p>
          </div>
          <Link href="/products" className="mt-6">
            <Button variant="secondary">Discover new</Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}