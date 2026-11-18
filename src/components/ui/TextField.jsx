import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const TextField = forwardRef(function TextField(
  { id, label, error, className, inputClassName, hint, ...props },
  ref,
) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? (
        <label htmlFor={id} className="block text-sm font-medium text-ink">
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        id={id}
        className={cn(
          "h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-ink placeholder:text-muted/80",
          error ? "border-discount" : "border-line focus:border-primary",
          inputClassName,
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...props}
      />
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-discount" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});

export default TextField;