import { cn } from "../../utils/cn";

export default function Card({ children, className, as: Component = "div", ...props }) {
  return (
    <Component
      className={cn(
        "rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ title, subtitle, className }) {
  return (
    <header className={cn("mb-6 space-y-1", className)}>
      {title ? <h1 className="text-2xl font-bold tracking-tight text-ink">{title}</h1> : null}
      {subtitle ? <p className="text-sm text-muted">{subtitle}</p> : null}
    </header>
  );
}