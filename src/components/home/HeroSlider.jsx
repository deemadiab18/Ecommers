"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Container from "../layout/Container";
import Button from "../ui/Button";
import { STORE } from "../../constants/store";
import { cn } from "../../utils/cn";

const SLIDES = [
  {
    eyebrow: "Fresh this week",
    title: "Farm-fresh groceries delivered across Cairo",
    text: `Free delivery on orders over ${STORE.freeShipping} EGP — shop local produce, pantry staples, and more.`,
    cta: { label: "Shop now", to: "/products" },
    secondary: { label: "View categories", to: "/categories" },
    tone: "from-primary/15 via-mint to-white",
  },
  {
    eyebrow: "Top rated picks",
    title: "Customer favourites you’ll love",
    text: "Discover highly rated products picked by the FreshCart community.",
    cta: { label: "Browse top rated", to: "/products?sort=-ratingsAverage" },
    secondary: { label: "Create account", to: "/register" },
    tone: "from-star/20 via-white to-mint",
  },
  {
    eyebrow: "Trusted brands",
    title: "Quality brands, fair prices",
    text: "From household names to local producers — all in one cart.",
    cta: { label: "Explore brands", to: "/brands" },
    secondary: { label: "Sign in", to: "/login" },
    tone: "from-mint-deep via-white to-surface",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  function go(delta) {
    setIndex((current) => (current + delta + SLIDES.length) % SLIDES.length);
  }

  return (
    <section className="border-b border-line bg-white">
      <Container className="relative py-10 sm:py-14">
        <div
          className={cn(
            "grid gap-8 overflow-hidden rounded-3xl border border-line p-6 sm:p-10 lg:grid-cols-2 lg:items-center bg-gradient-to-br",
            slide.tone,
          )}
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">{slide.eyebrow}</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              {slide.title}
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted">{slide.text}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={slide.cta.to}>
                <Button>{slide.cta.label}</Button>
              </Link>
              <Link href={slide.secondary.to}>
                <Button variant="secondary">{slide.secondary.label}</Button>
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="rounded-2xl border border-line/80 bg-white/80 p-6 shadow-card backdrop-blur">
              <p className="text-sm font-medium text-ink">Why FreshCart?</p>
              <ul className="mt-4 space-y-3 text-sm text-muted">
                <li>Same-day slots across Greater Cairo</li>
                <li>Secure checkout — cash or card</li>
                <li>Thousands of products from Route Academy catalog</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === index ? "w-8 bg-primary" : "w-2 bg-line hover:bg-primary/40",
                )}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-xl border border-line bg-white hover:bg-mint"
              aria-label="Previous slide"
              onClick={() => go(-1)}
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-xl border border-line bg-white hover:bg-mint"
              aria-label="Next slide"
              onClick={() => go(1)}
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}