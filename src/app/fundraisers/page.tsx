import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { HandCoins, Plus } from "lucide-react";
import { db } from "~/server/db";
import { getCurrentUser } from "~/lib/user";
import { can } from "~/lib/roles";
import { Eyebrow, Reveal, Section } from "~/components/primitives";

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

  const liveCount = fundraisers.filter((f) => !f.isClosed).length;

  return (
    <Section accent="yellow">
      <div className="container-page">
        <div className="page-head">
          <div>
            <Eyebrow>Support the club</Eyebrow>
            <h1>Fundraisers.</h1>
            <p className="sub" style={{ marginTop: 10 }}>
              Ongoing campaigns for prizes, cards, and club events.{" "}
              {liveCount} live right now.
            </p>
          </div>
          {canManage ? (
            <Link href="/fundraisers/new" className="btn btn-primary btn-sm">
              <Plus size={14} />
              New fundraiser
            </Link>
          ) : null}
        </div>

        {fundraisers.length === 0 ? (
          <div className="empty-state">
            <HandCoins size={28} className="empty-state-icon" />
            <div className="empty-state-title">No fundraisers yet.</div>
            <div className="empty-state-sub">
              {canManage
                ? "You can spin up the first one."
                : "Check back once officers launch one."}
            </div>
          </div>
        ) : (
          <Reveal as="ul" className="fund-grid" stagger>
            {fundraisers.map((f) => {
              const raised = f.raisedCents;
              const goal = f.goalCents;
              const pct =
                goal && goal > 0
                  ? Math.min(100, Math.round((raised / goal) * 100))
                  : null;
              const status = f.isClosed ? "closed" : "open";
              const railStyle: CSSProperties = {
                ["--pct" as string]: `${pct ?? 0}%`,
              };

              return (
                <li key={f.id}>
                  <Link
                    href={`/fundraisers/${f.id}`}
                    className="fund-card"
                    data-closed={f.isClosed}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="fund-card-head">
                      <h3 className="fund-card-title">{f.title}</h3>
                      <span className="status-chip" data-status={status}>
                        {f.isClosed ? "closed" : "live"}
                      </span>
                    </div>
                    <p className="fund-card-desc">{f.description}</p>

                    <div style={{ display: "grid", gap: 8 }}>
                      <div className="money-readout">
                        <span
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 22,
                            letterSpacing: "-0.02em",
                            color: "var(--text)",
                          }}
                        >
                          {dollars.format(raised / 100)}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                            color: "var(--text-3)",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {goal
                            ? `of ${dollars.format(goal / 100)}${pct !== null ? ` · ${pct}%` : ""}`
                            : "raised"}
                        </span>
                      </div>
                      {pct !== null ? (
                        <div
                          className="progress-rail"
                          data-closed={f.isClosed}
                          style={railStyle}
                        >
                          <div className="progress-rail-fill" />
                        </div>
                      ) : null}
                    </div>

                    <div className="fund-card-footer">
                      by {f.createdBy.displayName}
                    </div>
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
