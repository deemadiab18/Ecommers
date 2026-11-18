import { cn } from "../../utils/cn";

export default function Badge({
  children,
  className,
  variant = "default",
  as: Component = "span",
}) {
  const variants = {
    default: "bg-mint text-primary",
    count: "bg-primary text-white",
    muted: "bg-surface text-muted",
    sale: "bg-discount/10 text-discount",
  };

  return (
    <Component
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold",
        variants[variant],
        className,
      )}
    >
      {children}
    </Component>
  );
}