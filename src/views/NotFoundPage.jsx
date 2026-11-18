import Link from "next/link";
import Container from "../components/layout/Container";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function NotFoundPage() {
  return (
    <Container className="flex min-h-[50vh] items-center justify-center py-16">
      <Card className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">404</p>
        <h1 className="mt-2 text-2xl font-bold text-ink">Page not found</h1>
        <p className="mt-2 text-sm text-muted">The link may be broken or the page may have been removed.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/">
            <Button>Back to home</Button>
          </Link>
          <Link href="/products">
            <Button variant="secondary">Browse shop</Button>
          </Link>
        </div>
      </Card>
    </Container>
  );
}