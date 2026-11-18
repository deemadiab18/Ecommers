"use client";

import { forwardRef, useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../utils/cn";

const PasswordField = forwardRef(function PasswordField(
  { id: idProp, label, error, className, hint, ...props },
  ref,
) {
  const autoId = useId();
  const id = idProp || autoId;
  const [visible, setVisible] = useState(false);

  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? (
        <label htmlFor={id} className="block text-sm font-medium text-ink">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type={visible ? "text" : "password"}
          className={cn(
            "h-11 w-full rounded-xl border bg-white px-3.5 pr-11 text-sm text-ink placeholder:text-muted/80",
            error ? "border-discount" : "border-line focus:border-primary",
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          {...props}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-1 my-auto flex size-9 items-center justify-center rounded-lg text-muted hover:bg-surface hover:text-ink"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
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

export default PasswordField;