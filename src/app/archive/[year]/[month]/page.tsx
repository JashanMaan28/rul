import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trophy } from "lucide-react";
import { db } from "~/server/db";
import { parseArchiveSnapshot } from "~/server/archive";
import type { MonthStandings } from "~/server/standings";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

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
    <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/archive"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-4")}
      >
        <ArrowLeft className="mr-1 size-4" />
        All months
      </Link>
      <h1 className="text-3xl font-bold tracking-tight">{label}</h1>
      <p className="text-muted-foreground mb-8 text-sm">
        Closed on {archive.closedAt.toLocaleString()}
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <StandingsCard
          title="Community — silver"
          tier="silver"
          rows={standings.community}
        />
        <StandingsCard title="Pro — gold" tier="gold" rows={standings.pro} />
      </div>
    </section>
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
    <div className="bg-card rounded-2xl border">
      <div className="flex items-center gap-2 border-b px-5 py-3">
        <Trophy
          className={cn(
            "size-4",
            tier === "silver"
              ? "text-[color:var(--trophy-silver)]"
              : "text-[color:var(--trophy-gold)]",
          )}
        />
        <span className="font-semibold">{title}</span>
      </div>
      {rows.length === 0 ? (
        <p className="text-muted-foreground px-5 py-6 text-center text-sm">
          No wins recorded this month.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">Wins</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={row.userId}>
                <TableCell className="text-muted-foreground font-mono">
                  {i + 1}
                </TableCell>
                <TableCell className="font-medium">{row.displayName}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {row.wins}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
