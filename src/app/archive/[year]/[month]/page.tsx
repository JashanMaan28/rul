import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trophy } from "lucide-react";
import { db } from "~/server/db";
import { parseArchiveSnapshot } from "~/server/archive";
import type { MonthStandings } from "~/server/standings";
import { Eyebrow, Reveal, Section } from "~/components/primitives";

const monthFmt = new Intl.DateTimeFormat("en-US", { month: "long" });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}): Promise<Metadata> {
  const { year, month } = await params;
  const label = `${monthFmt.format(new Date(Number(year), Number(month) - 1, 1))} ${year}`;
  return { title: `${label} hall of fame` };
}

export default async function ArchiveDetailPage({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;
  const yearNum = Number(year);
  const monthNum = Number(month);
  if (!Number.isInteger(yearNum) || !Number.isInteger(monthNum)) notFound();

  const archive = await db.monthlyArchive.findUnique({
    where: { year_month: { year: yearNum, month: monthNum } },
  });
  if (!archive) notFound();

  const standings = parseArchiveSnapshot(archive.snapshot);
  const label = `${monthFmt.format(new Date(yearNum, monthNum - 1, 1))} ${yearNum}`;

  return (
    <Section accent="yellow">
      <article className="container-page" style={{ maxWidth: 880 }}>
        <Link href="/archive" className="back-link">
          <ArrowLeft size={12} />
          All months
        </Link>

        <div className="page-head">
          <div>
            <Eyebrow>Hall of fame</Eyebrow>
            <h1>{label}</h1>
            <p className="sub" style={{ marginTop: 10 }}>
              Closed on {archive.closedAt.toLocaleString()}
            </p>
          </div>
        </div>

        <Reveal as="div" className="standings-grid" stagger>
          <StandingsCard
            title="Community — silver"
            tier="silver"
            rows={standings.community}
          />
          <StandingsCard title="Pro — gold" tier="gold" rows={standings.pro} />
        </Reveal>
      </article>
    </Section>
  );
}

function StandingsCard({
  title,
  tier,
  rows,
}: {
  title: string;
  tier: "silver" | "gold";
  rows: MonthStandings["community"];
}) {
  return (
    <div className="standings-card">
      <div className="standings-card-head" data-tier={tier}>
        <Trophy size={14} className="standings-trophy-icon" />
        <span className="standings-card-title">{title}</span>
      </div>
      {rows.length === 0 ? (
        <p className="standings-empty">No wins recorded this month.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 48 }}>#</th>
              <th>Player</th>
              <th className="cell-right">Wins</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.userId}>
                <td className="cell-note">{i + 1}</td>
                <td className="cell-name">{row.displayName}</td>
                <td
                  className="cell-right"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {row.wins}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
