import { cn } from "../../utils/cn";

export default function Button({
  children,
  className,
  variant = "primary",
  type = "button",
  loading,
  disabled,
  ...props
}) {
  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary-hover shadow-sm disabled:opacity-60",
    secondary: "border border-line bg-white text-ink hover:bg-surface disabled:opacity-60",
    ghost: "text-primary hover:bg-mint disabled:opacity-60",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-colors",
        variants[variant],
        className,
      )}
      {...props}
    >
      {loading ? (
        <>
          <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          Working…
        </>
      ) : (
        children
      )}
    </button>
  );
}