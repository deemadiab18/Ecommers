import Button from "./Button";

export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-12 text-center">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      {description ? <p className="mt-2 text-sm text-muted">{description}</p> : null}
      {actionLabel && onAction ? (
        <Button type="button" className="mt-4" variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}