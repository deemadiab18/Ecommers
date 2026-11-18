"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "../components/layout/Container";
import CatalogPageHeader from "../components/catalog/CatalogPageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { SITE_PAGES } from "../constants/content";
import { STORE } from "../constants/store";

export default function InfoPage() {
  const pathname = usePathname();
  const page = SITE_PAGES[pathname];

  if (!page) {
    return (
      <Container className="py-12">
        <Card className="mx-auto max-w-lg text-center">
          <h1 className="text-xl font-bold text-ink">Page not found</h1>
          <Link href="/" className="mt-4 inline-block">
            <Button>Back to home</Button>
          </Link>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <CatalogPageHeader title={page.title} subtitle={page.intro} />
      <Card className="mx-auto max-w-3xl space-y-8">
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-semibold text-ink">{section.heading}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">
              {section.body.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        ))}
        {pathname === "/contact" ? (
          <div className="flex flex-wrap gap-3 border-t border-line pt-6">
            <a href={STORE.phoneHref}>
              <Button type="button" variant="secondary">
                Call {STORE.phone}
              </Button>
            </a>
            <a href={`mailto:${STORE.email}`}>
              <Button type="button" variant="secondary">
                Email us
              </Button>
            </a>
          </div>
        ) : null}
      </Card>
    </Container>
  );
}