"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppNavLink({ href, end, className, children }) {
  const pathname = usePathname();
  const isActive = end
    ? pathname === href
    : pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  const classes = typeof className === "function" ? className({ isActive }) : className;

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}