import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Aurora, Eyebrow, GridBG } from "~/components/primitives";

type ComingSoonProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
};

export function ComingSoon({
  title,
  description,
  children,
  backHref = "/",
  backLabel = "Back to home",
}: ComingSoonProps) {
  return (
    <section className="coming-soon-shell">
      <Aurora />
      <GridBG />
      <div className="coming-soon-inner">
        <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
          <Eyebrow>Coming soon</Eyebrow>
          <h1 className="coming-soon-title">{title}</h1>
          <p className="coming-soon-desc">{description}</p>
        </div>
        {children}
        <Link href={backHref} className="back-link" style={{ marginTop: 6 }}>
          <ArrowLeft size={12} />
          {backLabel}
        </Link>
      </div>
    </section>
  );
}
