import type { Metadata } from "next";
import { Eyebrow, Section } from "~/components/primitives";

export const metadata: Metadata = {
  title: "Constitution",
  description: "The official constitution of Ripon Uno League.",
};

export default function ConstitutionPage() {
  return (
    <Section accent="red">
      <div className="container-page" style={{ maxWidth: 760 }}>
        <div className="page-head">
          <div>
            <Eyebrow>The rulebook</Eyebrow>
            <h1>Constitution.</h1>
            <p className="sub" style={{ marginTop: 10 }}>
              The governing document of Ripon Uno League — structure, elections,
              meetings, and how decisions get made.
            </p>
          </div>
        </div>

        <div
          className="callout"
          style={{
            marginTop: 28,
            padding: "32px 28px",
            textAlign: "center",
          }}
        >
          <div
            className="mono faint"
            style={{
              fontSize: 11,
              letterSpacing: "0.12em",
              marginBottom: 8,
            }}
          >
            STATUS
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em" }}>
            Coming soon.
          </div>
          <p
            className="muted"
            style={{
              fontSize: 13.5,
              lineHeight: 1.55,
              marginTop: 10,
              maxWidth: 440,
              marginInline: "auto",
            }}
          >
            The officers are still drafting. Check back once it&apos;s ratified
            at a Wednesday meeting.
          </p>
        </div>
      </div>
    </Section>
  );
}
