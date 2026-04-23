import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Aurora, Eyebrow, GridBG } from "~/components/primitives";

export default function NotFound() {
  return (
    <section className="not-found-shell">
      <Aurora />
      <GridBG />
      <div className="not-found-inner">
        <Eyebrow>Page not found</Eyebrow>
        <p className="not-found-code">404</p>
        <h1 className="not-found-title">This card isn&apos;t in the deck.</h1>
        <p className="not-found-desc">
          The page you&apos;re after either moved, was skipped, or never got
          dealt. Head back to the table and pick a different route.
        </p>
        <Link href="/" className="back-link" style={{ marginTop: 6 }}>
          <ArrowLeft size={12} />
          Back to home
        </Link>
      </div>
    </section>
  );
}
