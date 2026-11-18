import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

export default function Spinner({ label, className }) {
  return (
    <div className={cn("flex flex-col items-center gap-3 text-muted", className)} role="status">
      <Loader2 className="size-8 animate-spin text-primary" aria-hidden />
      {label ? <p className="text-sm">{label}</p> : null}
    </div>
  );
}