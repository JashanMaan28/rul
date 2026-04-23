import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Vote as VoteIcon } from "lucide-react";
import { db } from "~/server/db";
import { getCurrentUser } from "~/lib/user";
import { can } from "~/lib/roles";
import { Eyebrow, Reveal, Section } from "~/components/primitives";

export const metadata: Metadata = {
  title: "Vote",
  description:
    "Officers float future-feature ideas, members vote on what gets built next.",
};

export default async function PollsPage() {
  const currentUser = await getCurrentUser();
  const canCreate = currentUser
    ? can(currentUser.roles, "create_polls")
    : false;

  const polls = await db.poll.findMany({
    orderBy: [{ isClosed: "asc" }, { createdAt: "desc" }],
    include: {
      createdBy: { select: { displayName: true } },
      _count: { select: { votes: true } },
    },
  });

  const openCount = polls.filter((p) => !p.isClosed).length;

  return (
    <Section accent="red">
      <div className="container-page">
        <div className="page-head">
          <div>
            <Eyebrow>Vote on the future</Eyebrow>
            <h1>Officer polls.</h1>
            <p className="sub" style={{ marginTop: 10 }}>
              One vote per poll. Votes are final once cast. {openCount} open
              right now.
            </p>
          </div>
          {canCreate ? (
            <Link href="/polls/new" className="btn btn-primary btn-sm">
              <Plus size={14} />
              New poll
            </Link>
          ) : null}
        </div>

        {polls.length === 0 ? (
          <div
            className="callout"
            style={{
              textAlign: "center",
              padding: "48px 24px",
              borderStyle: "dashed",
            }}
          >
            <VoteIcon
              size={28}
              style={{
                color: "var(--text-3)",
                display: "block",
                margin: "0 auto 10px",
              }}
            />
            <div style={{ fontWeight: 600, color: "var(--text)" }}>
              No polls yet.
            </div>
            <div style={{ marginTop: 4 }}>
              {canCreate
                ? "You can spin up the first one."
                : "Check back once officers post one."}
            </div>
          </div>
        ) : (
          <Reveal as="ul" className="poll-list" stagger>
            {polls.map((poll) => {
              const status = poll.isClosed ? "closed" : "open";
              const voteLabel = `${poll._count.votes} vote${
                poll._count.votes === 1 ? "" : "s"
              }`;
              const closesLabel = poll.closesAt
                ? ` · closes ${poll.closesAt.toLocaleDateString()}`
                : "";
              return (
                <li key={poll.id}>
                  <Link
                    href={`/polls/${poll.id}`}
                    className="poll-row"
                    style={{ textDecoration: "none" }}
                  >
                    <div className="poll-row-main">
                      <div className="poll-row-title">
                        <h3>{poll.title}</h3>
                        <span className="status-chip" data-status={status}>
                          {status}
                        </span>
                      </div>
                      <div className="poll-row-meta">
                        by {poll.createdBy.displayName} · {voteLabel}
                        {closesLabel}
                      </div>
                    </div>
                    <span className="poll-row-arrow" aria-hidden>
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
