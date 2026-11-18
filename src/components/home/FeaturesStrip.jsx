import { Headphones, RotateCcw, Shield, Truck } from "lucide-react";
import Container from "../layout/Container";
import { STORE } from "../../constants/store";

const FEATURES = [
  { icon: Truck, title: "Free Shipping", text: `On orders over ${STORE.freeShipping} EGP` },
  { icon: RotateCcw, title: "Easy Returns", text: "Hassle-free return policy" },
  { icon: Shield, title: "Secure Payment", text: "Cash or card checkout" },
  { icon: Headphones, title: "24/7 Support", text: STORE.phone },
];

export default function FeaturesStrip() {
  return (
    <section className="border-b border-line bg-surface py-8">
      <Container className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-card">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-mint text-primary">
              <Icon className="size-5" aria-hidden />
            </span>
            <div>
              <p className="font-semibold text-ink">{title}</p>
              <p className="mt-0.5 text-sm text-muted">{text}</p>
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}