import { cn } from "../../utils/cn";

export default function SelectField({ id, label, error, className, children, ...props }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? (
        <label htmlFor={id} className="block text-sm font-medium text-ink">
          {label}
        </label>
      ) : null}
      <select
        id={id}
        className={cn(
          "h-11 w-full rounded-xl border bg-white px-3 text-sm text-ink",
          error ? "border-discount" : "border-line focus:border-primary",
        )}
        aria-invalid={Boolean(error)}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <p className="text-xs text-discount" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}