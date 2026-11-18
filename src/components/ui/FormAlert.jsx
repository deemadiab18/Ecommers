import { AlertCircle } from "lucide-react";
import { cn } from "../../utils/cn";

export default function FormAlert({ children, className }) {
  if (!children) return null;
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-xl border border-discount/30 bg-red-50 px-3 py-2 text-sm text-discount",
        className,
      )}
      role="alert"
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
      <span>{children}</span>
    </div>
  );
}