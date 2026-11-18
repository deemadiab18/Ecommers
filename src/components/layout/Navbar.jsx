"use client";

import Link from "next/link";
import AppNavLink from "@/components/routing/AppNavLink";
import { useState } from "react";
import { Heart, Menu, ShoppingBag } from "lucide-react";
import Container from "./Container";
import Logo from "./Logo";
import NavbarSearch from "./NavbarSearch";
import CategoriesMenu from "./CategoriesMenu";
import UserMenu from "./UserMenu";
import MobileDrawer from "./MobileDrawer";
import IconButton from "../ui/IconButton";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useCartSummary } from "../../hooks/useCart";
import { useWishlistSummary } from "../../hooks/useWishlist";
import { cn } from "../../utils/cn";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/products", label: "Shop" },
  { to: "/brands", label: "Brands" },
];

function NavItem({ to, label, end }) {
  return (
    <AppNavLink
      href={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isActive ? "bg-mint text-primary" : "text-ink hover:bg-surface",
        )
      }
    >
      {label}
    </AppNavLink>
  );
}

export default function Navbar() {
  const { status } = useAuth();
  const signedIn = status === "authenticated";
  const cart = useCartSummary();
  const wishlist = useWishlistSummary();
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartCount = cart.data?.numOfCartItems ?? 0;
  const wishCount = wishlist.data?.count ?? 0;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <Container className="flex h-16 items-center gap-3 sm:gap-4">
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-xl border border-line bg-white text-ink lg:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-5" />
          </button>

          <Logo className="shrink-0" />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
            <CategoriesMenu />
          </nav>

          <div className="ml-auto hidden flex-1 justify-center lg:flex">
            <NavbarSearch />
          </div>

          <div className="flex items-center gap-2">
            {signedIn ? (
              <>
                <IconButton
                  to="/wishlist"
                  label="Wishlist"
                  icon={Heart}
                  count={wishCount}
                  className="hidden sm:inline-flex"
                />
                <IconButton to="/cart" label="Cart" icon={ShoppingBag} count={cartCount} />
                <div className="hidden md:block">
                  <UserMenu />
                </div>
              </>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link href="/login">
                  <Button variant="ghost" className="h-10 px-4">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="h-10 px-4">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </Container>
      </header>

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}