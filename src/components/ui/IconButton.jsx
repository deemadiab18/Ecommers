import Link from "next/link";
import { cn } from "../../utils/cn";
import Badge from "./Badge";

export default function IconButton({ to, label, icon: Icon, count, className, onClick }) {
  const inner = (
    <>
      <Icon className="size-5" aria-hidden />
      {count > 0 ? (
        <Badge
          variant="count"
          className="absolute -right-1 -top-1 min-w-5 px-1.5 py-0 text-[10px] leading-none"
        >
          {count > 99 ? "99+" : count}
        </Badge>
      ) : null}
    </>
  );

  const shared = cn(
    "relative flex size-10 items-center justify-center rounded-xl border border-line bg-white text-ink transition-colors hover:border-primary/30 hover:bg-mint hover:text-primary",
    className,
  );

  if (to) {
    return (
      <Link href={to} className={shared} aria-label={count ? `${label}, ${count} items` : label}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" className={shared} aria-label={label} onClick={onClick}>
      {inner}
    </button>
  );
}