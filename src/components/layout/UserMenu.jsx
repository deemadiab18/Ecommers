"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, KeyRound, LogOut, Package, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/cn";

export default function UserMenu({ onNavigate }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handlePointer(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handlePointer);
    return () => document.removeEventListener("mousedown", handlePointer);
  }, [open]);

  function pick() {
    setOpen(false);
    onNavigate?.();
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="inline-flex max-w-[11rem] items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-sm font-medium text-ink hover:border-primary/30 hover:bg-mint"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="flex size-8 items-center justify-center rounded-lg bg-mint text-primary">
          <User className="size-4" aria-hidden />
        </span>
        <span className="hidden truncate sm:inline">{user?.name}</span>
        <ChevronDown className={cn("size-4 shrink-0 text-muted", open && "rotate-180")} aria-hidden />
      </button>
      {open ? (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-line bg-white p-2 shadow-lg"
          role="menu"
        >
          <p className="border-b border-line px-3 py-2 text-xs text-muted">{user?.email}</p>
          <MenuLink to="/profile" icon={User} onClick={pick}>
            Profile
          </MenuLink>
          <MenuLink to="/allorders" icon={Package} onClick={pick}>
            My orders
          </MenuLink>
          <MenuLink to="/change-password" icon={KeyRound} onClick={pick}>
            Change password
          </MenuLink>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-discount hover:bg-red-50"
            onClick={() => {
              pick();
              logout();
            }}
          >
            <LogOut className="size-4" aria-hidden />
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
}

function MenuLink({ to, icon: Icon, children, onClick }) {
  return (
    <Link
      href={to}
      role="menuitem"
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink hover:bg-mint"
      onClick={onClick}
    >
      <Icon className="size-4 text-muted" aria-hidden />
      {children}
    </Link>
  );
}