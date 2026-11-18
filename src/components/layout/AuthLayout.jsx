import Link from "next/link";
import { Leaf } from "lucide-react";
import { STORE } from "../../constants/store";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-canvas px-4 py-10">
      <div className="mx-auto w-full max-w-md">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-lg font-bold text-ink">
          <span className="flex size-9 items-center justify-center rounded-xl bg-mint text-primary">
            <Leaf className="size-5" aria-hidden />
          </span>
          {STORE.name}
        </Link>
        <div className="rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8">
          <header className="mb-6 space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-ink">{title}</h1>
            {subtitle ? <p className="text-sm text-muted">{subtitle}</p> : null}
          </header>
          {children}
        </div>
        {footer ? <div className="mt-6 text-center text-sm text-muted">{footer}</div> : null}
      </div>
    </div>
  );
}