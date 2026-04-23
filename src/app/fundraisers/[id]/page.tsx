import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { db } from "~/server/db";
import { getCurrentUser } from "~/lib/user";
import { can } from "~/lib/roles";
import { Eyebrow, Reveal, Section } from "~/components/primitives";
import { RaisedControls } from "./raised-controls";

const dollars = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
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
  const status = fundraiser.isClosed ? "closed" : "open";
  const railStyle: CSSProperties = {
    ["--pct" as string]: `${pct ?? 0}%`,
  };

  return (
    <Section accent="yellow">
      <article className="container-page" style={{ maxWidth: 760 }}>
        <Link href="/fundraisers" className="back-link">
          <ArrowLeft size={12} />
          All fundraisers
        </Link>

        <div className="page-head">
          <div>
            <Eyebrow>Fundraiser</Eyebrow>
            <h1>{fundraiser.title}</h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginTop: 14,
                flexWrap: "wrap",
              }}
            >
              <span className="status-chip" data-status={status}>
                {fundraiser.isClosed ? "closed" : "live"}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--text-3)",
                  letterSpacing: "0.02em",
                }}
              >
                by {fundraiser.createdBy.displayName}
              </span>
            </div>
          </div>
          {canManage ? (
            <div className="action-row">
              <Link
                href={`/fundraisers/${fundraiser.id}/edit`}
                className="btn btn-ghost btn-sm"
              >
                <Pencil size={14} />
                Edit
              </Link>
            </div>
          ) : null}
        </div>

        <Reveal as="div" stagger style={{ display: "grid", gap: 14 }}>
          <div className="money-card">
            <div className="money-readout">
              <span className="money-readout-raised">
                {dollars.format(raised / 100)}
              </span>
              <span className="money-readout-goal">
                {goal ? `of ${dollars.format(goal / 100)} goal` : "raised"}
              </span>
            </div>
            {pct !== null ? (
              <>
                <div
                  className="progress-rail progress-rail--tall"
                  data-closed={fundraiser.isClosed}
                  style={railStyle}
                >
                  <div className="progress-rail-fill" />
                </div>
                <span className="progress-hint">{pct}% there</span>
              </>
            ) : null}
          </div>

          <div className="about-card">
            <h2>About</h2>
            <p>{fundraiser.description}</p>
            {fundraiser.startsAt || fundraiser.endsAt ? (
              <div className="dates">
                {fundraiser.startsAt
                  ? `Started ${dateFmt.format(fundraiser.startsAt)}`
                  : null}
                {fundraiser.startsAt && fundraiser.endsAt ? " · " : null}
                {fundraiser.endsAt
                  ? `Ends ${dateFmt.format(fundraiser.endsAt)}`
                  : null}
              </div>
            ) : null}
          </div>

          {canManage ? (
            <RaisedControls
              id={fundraiser.id}
              raisedDollars={raised / 100}
              isClosed={fundraiser.isClosed}
            />
          ) : null}
        </Reveal>
      </article>
    </Section>
  );
}
