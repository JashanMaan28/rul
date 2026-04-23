import type { Metadata } from "next";
import Link from "next/link";
import { HandCoins, Plus } from "lucide-react";
import { db } from "~/server/db";
import { getCurrentUser } from "~/lib/user";
import { can } from "~/lib/roles";
import { buttonVariants } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { cn } from "~/lib/utils";

export const metadata: Metadata = {
  title: "Fundraisers",
  description:
    "Support the Ripon Uno League. Track our fundraising campaigns and goals.",
};

const dollars = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default async function FundraisersPage() {
  const currentUser = await getCurrentUser();
  const canManage = currentUser
    ? can(currentUser.roles, "manage_fundraisers")
    : false;

  const fundraisers = await db.fundraiser.findMany({
    orderBy: [{ isClosed: "asc" }, { createdAt: "desc" }],
    include: { createdBy: { select: { displayName: true } } },
  });

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <div className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
            Support the club
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Fundraisers</h1>
          <p className="text-muted-foreground text-sm">
            Ongoing campaigns raising money for prizes, cards, and club events.
          </p>
        </div>
        {canManage ? (
          <Link
            href="/fundraisers/new"
            className={cn(buttonVariants({ size: "sm" }))}
          >
            <Plus className="size-4" />
            New fundraiser
          </Link>
        ) : null}
      </div>

      {fundraisers.length === 0 ? (
        <div className="bg-muted/30 rounded-2xl border border-dashed p-12 text-center">
          <HandCoins className="text-muted-foreground mx-auto size-10" />
          <p className="mt-3 font-medium">No fundraisers yet.</p>
          <p className="text-muted-foreground text-sm">
            {canManage
              ? "You can spin up the first one."
              : "Check back once officers launch one."}
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {fundraisers.map((f) => {
            const raised = f.raisedCents;
            const goal = f.goalCents;
            const pct =
              goal && goal > 0
                ? Math.min(100, Math.round((raised / goal) * 100))
                : null;

            return (
              <li key={f.id}>
                <Link
                  href={`/fundraisers/${f.id}`}
                  className="group bg-card block h-full rounded-2xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-semibold group-hover:underline">
                      {f.title}
                    </h2>
                    {f.isClosed ? (
                      <Badge variant="secondary">Closed</Badge>
                    ) : (
                      <Badge
                        variant="default"
                        className="bg-[color:var(--uno-green)]"
                      >
                        Live
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                    {f.description}
                  </p>

                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="font-semibold">
                        {dollars.format(raised / 100)}
                      </span>
                      {goal ? (
                        <span className="text-muted-foreground">
                          of {dollars.format(goal / 100)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">raised</span>
                      )}
                    </div>
                    {pct !== null ? <Progress value={pct} /> : null}
                  </div>

                  <p className="text-muted-foreground mt-3 text-xs">
                    by {f.createdBy.displayName}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
