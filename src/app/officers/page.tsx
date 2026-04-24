import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { OFFICERS, ROLE_LABEL } from "~/lib/officers";
import { Eyebrow, Reveal, Section } from "~/components/primitives";

export const metadata: Metadata = {
  title: "Officers",
  description: "The people running Ripon Uno League.",
};

export default function OfficersPage() {
  return (
    <Section accent="blue">
      <div className="container-page" style={{ maxWidth: 1040 }}>
        <div className="page-head">
          <div>
            <Eyebrow>Who runs it</Eyebrow>
            <h1>Officer roster.</h1>
            <p className="sub" style={{ marginTop: 10 }}>
              Elected students plus a teacher rep. Decisions happen in the open,
              at the Wednesday meeting.
            </p>
          </div>
        </div>

        <Reveal as="ul" className="off-grid" stagger>
          {OFFICERS.map((officer) => {
            const init = officer.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("");
            return (
              <li
                key={officer.name}
                className="off"
                style={{ listStyle: "none" }}
              >
                <span
                  className="off-ava"
                  style={{
                    background: `color-mix(in srgb, var(--uno-${officer.accent}) 22%, var(--surface-2))`,
                    borderColor: `color-mix(in srgb, var(--uno-${officer.accent}) 45%, var(--border))`,
                  }}
                  aria-hidden
                >
                  {init}
                </span>
                <div className="off-role">{ROLE_LABEL[officer.role]}</div>
                <div className="off-name">{officer.name}</div>
                <div className="off-note">{officer.title}</div>
              </li>
            );
          })}
        </Reveal>

        <div
          className="callout"
          style={{
            marginTop: 28,
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <MessageCircle
            size={18}
            style={{ color: "var(--text-3)", flexShrink: 0 }}
          />
          <span>
            Need to reach an officer? Members can{" "}
            <Link href="/chat">open a DM from chat</Link> — every officer has
            one lane open.
          </span>
        </div>
      </div>
    </Section>
  );
}
