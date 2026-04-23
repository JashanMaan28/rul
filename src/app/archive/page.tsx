import type { Metadata } from "next";
import Link from "next/link";
import { Medal } from "lucide-react";
import { db } from "~/server/db";
import { Badge } from "~/components/ui/badge";
import { parseArchiveSnapshot } from "~/server/archive";

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
    <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8 space-y-1">
        <div className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
          Monthly hall of fame
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Trophies reset. Glory doesn&apos;t.
        </h1>
        <p className="text-muted-foreground text-sm">
          Every 1st, last month&apos;s standings get archived here before
          trophies reset.
        </p>
      </div>

      {archives.length === 0 ? (
        <div className="bg-muted/30 rounded-2xl border border-dashed p-12 text-center">
          <Medal className="text-muted-foreground mx-auto size-10" />
          <p className="mt-3 font-medium">No archives yet.</p>
          <p className="text-muted-foreground mt-1 text-sm">
            The first snapshot is captured once we start recording games and the
            first month closes.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {archives.map((a) => {
            const snap = parseArchiveSnapshot(a.snapshot);
            const communityTop = snap.community[0];
            const proTop = snap.pro[0];
            const label = `${monthFmt.format(new Date(a.year, a.month - 1, 1))} ${a.year}`;
            return (
              <li key={a.id}>
                <Link
                  href={`/archive/${a.year}/${String(a.month).padStart(2, "0")}`}
                  className="bg-card flex items-center justify-between gap-4 rounded-2xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="min-w-0 space-y-2">
                    <h2 className="text-lg font-semibold">{label}</h2>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-[color:var(--trophy-silver)] text-[color:var(--uno-ink)]">
                        Silver: {communityTop?.displayName ?? "no winner"}
                        {communityTop ? ` · ${communityTop.wins}` : ""}
                      </Badge>
                      <Badge className="bg-[color:var(--trophy-gold)] text-[color:var(--uno-ink)]">
                        Gold: {proTop?.displayName ?? "no winner"}
                        {proTop ? ` · ${proTop.wins}` : ""}
                      </Badge>
                    </div>
                  </div>
                  <span className="text-muted-foreground text-sm">→</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
