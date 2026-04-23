import type { Metadata } from "next";
import Link from "next/link";
import { Medal } from "lucide-react";
import { db } from "~/server/db";
import { parseArchiveSnapshot } from "~/server/archive";
import { Eyebrow, Reveal, Section } from "~/components/primitives";

export const metadata: Metadata = {
  title: "Hall of Fame",
  description:
    "Past month winners of community (silver) and pro (gold) trophies.",
};

const monthFmt = new Intl.DateTimeFormat("en-US", { month: "long" });

export default async function ArchivePage() {
  const archives = await db.monthlyArchive.findMany({
    orderBy: [{ year: "desc" }, { month: "desc" }],
  });

  return (
    <Section accent="yellow">
      <div className="container-page" style={{ maxWidth: 880 }}>
        <div className="page-head">
          <div>
            <Eyebrow>Monthly hall of fame</Eyebrow>
            <h1>Trophies reset. Glory doesn&apos;t.</h1>
            <p className="sub" style={{ marginTop: 10 }}>
              Every 1st, last month&apos;s standings get archived here before
              trophies reset.
            </p>
          </div>
        </div>

        {archives.length === 0 ? (
          <div className="empty-state">
            <Medal size={28} className="empty-state-icon" />
            <div className="empty-state-title">No archives yet.</div>
            <div className="empty-state-sub">
              The first snapshot is captured once we start recording games and
              the first month closes.
            </div>
          </div>
        ) : (
          <Reveal
            as="ul"
            stagger
            style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}
          >
            {archives.map((a) => {
              const snap = parseArchiveSnapshot(a.snapshot);
              const communityTop = snap.community[0];
              const proTop = snap.pro[0];
              const label = `${monthFmt.format(new Date(a.year, a.month - 1, 1))} ${a.year}`;
              return (
                <li key={a.id}>
                  <Link
                    href={`/archive/${a.year}/${String(a.month).padStart(2, "0")}`}
                    className="archive-row"
                    style={{ textDecoration: "none" }}
                  >
                    <div className="archive-row-main">
                      <h2 className="archive-row-label">{label}</h2>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        <span className="trophy-chip" data-tier="silver">
                          <span className="trophy-chip-dot" aria-hidden />
                          Silver: {communityTop?.displayName ?? "no winner"}
                          {communityTop ? ` · ${communityTop.wins}` : ""}
                        </span>
                        <span className="trophy-chip" data-tier="gold">
                          <span className="trophy-chip-dot" aria-hidden />
                          Gold: {proTop?.displayName ?? "no winner"}
                          {proTop ? ` · ${proTop.wins}` : ""}
                        </span>
                      </div>
                    </div>
                    <span className="archive-row-arrow" aria-hidden>
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </Reveal>
        )}
      </div>
    </Section>
  );
}
