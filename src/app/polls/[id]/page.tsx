import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "~/server/db";
import { getCurrentUser } from "~/lib/user";
import { can } from "~/lib/roles";
import { Eyebrow, Reveal, Section } from "~/components/primitives";
import { VoteForm } from "./vote-form";
import { PollAdminControls } from "./admin-controls";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const poll = await db.poll.findUnique({
    where: { id },
    select: { title: true },
  });
  return { title: poll?.title ?? "Poll" };
}

export default async function PollPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  const poll = await db.poll.findUnique({
    where: { id },
    include: {
      createdBy: { select: { displayName: true } },
      options: {
        orderBy: { position: "asc" },
        include: { _count: { select: { votes: true } } },
      },
      _count: { select: { votes: true } },
      votes: currentUser
        ? { where: { userId: currentUser.id }, select: { pollOptionId: true } }
        : false,
    },
  });

  if (!poll) notFound();

  const myVote = currentUser ? (poll.votes[0]?.pollOptionId ?? null) : null;
  const totalVotes = poll._count.votes;
  const isExpired =
    poll.isClosed || (poll.closesAt ? poll.closesAt < new Date() : false);
  const status = isExpired ? "closed" : "open";
  const canClose = currentUser ? can(currentUser.roles, "close_polls") : false;

  return (
    <Section accent="blue">
      <div className="container-page" style={{ maxWidth: 760 }}>
        <Link href="/polls" className="back-link">
          <ArrowLeft size={12} />
          All polls
        </Link>

        <div className="page-head">
          <div>
            <Eyebrow>Poll</Eyebrow>
            <h1>{poll.title}</h1>
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
                {status}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--text-3)",
                  letterSpacing: "0.02em",
                }}
              >
                by {poll.createdBy.displayName} · {totalVotes} vote
                {totalVotes === 1 ? "" : "s"}
                {poll.closesAt
                  ? ` · ${isExpired ? "ended" : "closes"} ${poll.closesAt.toLocaleString()}`
                  : ""}
              </span>
            </div>
          </div>
          {canClose ? (
            <PollAdminControls pollId={poll.id} isClosed={poll.isClosed} />
          ) : null}
        </div>

        {poll.description ? (
          <div
            className="callout"
            style={{
              marginBottom: 24,
              whiteSpace: "pre-wrap",
              borderStyle: "solid",
              background: "var(--surface)",
            }}
          >
            {poll.description}
          </div>
        ) : null}

        <Reveal as="div">
          <VoteForm
            pollId={poll.id}
            options={poll.options.map((o) => ({
              id: o.id,
              label: o.label,
              votes: o._count.votes,
            }))}
            totalVotes={totalVotes}
            myVote={myVote}
            disabled={isExpired}
            signedIn={Boolean(currentUser)}
          />
        </Reveal>
      </div>
    </Section>
  );
}
