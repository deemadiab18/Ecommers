import Link from "next/link";
import { Leaf } from "lucide-react";
import { STORE } from "../../constants/store";
import { cn } from "../../utils/cn";

export default function Logo({ className, onClick }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn("inline-flex items-center gap-2 font-bold tracking-tight text-ink", className)}
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-mint text-primary">
        <Leaf className="size-5" aria-hidden />
      </span>
      <span className="text-lg sm:text-xl">{STORE.name}</span>
    </Link>
  );
}