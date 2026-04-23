import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { db } from "~/server/db";
import { getCurrentUser } from "~/lib/user";
import { can } from "~/lib/roles";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { RaisedControls } from "./raised-controls";

const dollars = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const f = await db.fundraiser.findUnique({
    where: { id },
    select: { title: true, description: true },
  });
  if (!f) return { title: "Fundraiser" };
  return { title: f.title, description: f.description.slice(0, 160) };
}

export default async function FundraiserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  const canManage = currentUser
    ? can(currentUser.roles, "manage_fundraisers")
    : false;

  const fundraiser = await db.fundraiser.findUnique({
    where: { id },
    include: { createdBy: { select: { displayName: true } } },
  });
  if (!fundraiser) notFound();

  const raised = fundraiser.raisedCents;
  const goal = fundraiser.goalCents;
  const pct =
    goal && goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : null;

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <Link
        href="/fundraisers"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-4")}
      >
        <ArrowLeft className="mr-1 size-4" />
        All fundraisers
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {fundraiser.title}
            </h1>
            {fundraiser.isClosed ? (
              <Badge variant="secondary">Closed</Badge>
            ) : (
              <Badge variant="default" className="bg-[color:var(--uno-green)]">
                Live
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            by {fundraiser.createdBy.displayName}
          </p>
        </div>
        {canManage ? (
          <Link
            href={`/fundraisers/${fundraiser.id}/edit`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <Pencil className="mr-1 size-4" />
            Edit
          </Link>
        ) : null}
      </div>

      <div className="bg-card mt-8 rounded-2xl border p-6">
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-bold">
            {dollars.format(raised / 100)}
          </span>
          {goal ? (
            <span className="text-muted-foreground text-sm">
              of {dollars.format(goal / 100)} goal
            </span>
          ) : (
            <span className="text-muted-foreground text-sm">raised</span>
          )}
        </div>
        {pct !== null ? (
          <div className="mt-3">
            <Progress value={pct} />
            <p className="text-muted-foreground mt-1 text-xs">{pct}% there</p>
          </div>
        ) : null}
      </div>

      <div className="bg-card mt-6 rounded-2xl border p-6">
        <h2 className="text-muted-foreground mb-2 text-sm font-semibold tracking-widest uppercase">
          About
        </h2>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {fundraiser.description}
        </p>
        {fundraiser.startsAt || fundraiser.endsAt ? (
          <p className="text-muted-foreground mt-4 text-xs">
            {fundraiser.startsAt
              ? `Started ${fundraiser.startsAt.toLocaleDateString()}`
              : null}
            {fundraiser.startsAt && fundraiser.endsAt ? " · " : null}
            {fundraiser.endsAt
              ? `Ends ${fundraiser.endsAt.toLocaleDateString()}`
              : null}
          </p>
        ) : null}
      </div>

      {canManage ? (
        <RaisedControls
          id={fundraiser.id}
          raisedDollars={raised / 100}
          isClosed={fundraiser.isClosed}
        />
      ) : null}
    </section>
  );
}
