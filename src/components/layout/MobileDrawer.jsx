"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Heart, ShoppingBag, X } from "lucide-react";
import Logo from "./Logo";
import NavbarSearch from "./NavbarSearch";
import CategoriesMenu from "./CategoriesMenu";
import { useAuth } from "../../context/AuthContext";
import { useCartSummary } from "../../hooks/useCart";
import { useWishlistSummary } from "../../hooks/useWishlist";
import Button from "../ui/Button";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Shop" },
  { to: "/brands", label: "Brands" },
  { to: "/categories", label: "Categories" },
];

export default function MobileDrawer({ open, onClose }) {
  const { status } = useAuth();
  const signedIn = status === "authenticated";
  const cart = useCartSummary();
  const wishlist = useWishlistSummary();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Site menu">
      <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Close menu" onClick={onClose} />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <Logo onClick={onClose} />
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-xl hover:bg-surface"
            aria-label="Close menu"
            onClick={onClose}
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <NavbarSearch id="mobile-search" className="mb-4 max-w-none" onDone={onClose} />
          <nav className="space-y-1">
            {LINKS.map((link) => (
              <Link
                key={link.to}
                href={link.to}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-mint"
                onClick={onClose}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 border-t border-line pt-4">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted">Categories</p>
            <CategoriesMenu compact onNavigate={onClose} />
          </div>
          {signedIn ? (
            <div className="mt-4 flex gap-2 border-t border-line pt-4">
              <Link
                href="/wishlist"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line py-2 text-sm font-medium"
                onClick={onClose}
              >
                <Heart className="size-4" />
                Wishlist ({wishlist.data?.count ?? 0})
              </Link>
              <Link
                href="/cart"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line py-2 text-sm font-medium"
                onClick={onClose}
              >
                <ShoppingBag className="size-4" />
                Cart ({cart.data?.numOfCartItems ?? 0})
              </Link>
            </div>
          ) : null}
        </div>
        <div className="border-t border-line p-4">
          {signedIn ? (
            <Link href="/profile" onClick={onClose}>
              <Button className="w-full" variant="secondary">
                My account
              </Button>
            </Link>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link href="/login" onClick={onClose}>
                <Button className="w-full" variant="secondary">
                  Sign in
                </Button>
              </Link>
              <Link href="/register" onClick={onClose}>
                <Button className="w-full">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}