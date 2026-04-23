import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "~/server/db";
import { getCurrentUser } from "~/lib/user";
import { can } from "~/lib/roles";
import { Badge } from "~/components/ui/badge";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
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

  const canClose = currentUser ? can(currentUser.roles, "close_polls") : false;

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <Link
        href="/polls"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-4")}
      >
        <ArrowLeft className="mr-1 size-4" />
        All polls
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{poll.title}</h1>
            {isExpired ? (
              <Badge variant="secondary">Closed</Badge>
            ) : (
              <Badge className="bg-[color:var(--uno-green)]">Open</Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            by {poll.createdBy.displayName} · {totalVotes} vote
            {totalVotes === 1 ? "" : "s"}
            {poll.closesAt
              ? ` · ${isExpired ? "ended" : "closes"} ${poll.closesAt.toLocaleString()}`
              : ""}
          </p>
        </div>
        {canClose ? (
          <PollAdminControls pollId={poll.id} isClosed={poll.isClosed} />
        ) : null}
      </div>

      {poll.description ? (
        <p className="bg-muted/30 text-muted-foreground mt-4 rounded-lg border p-4 text-sm whitespace-pre-wrap">
          {poll.description}
        </p>
      ) : null}

      <div className="mt-8">
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
      </div>
    </section>
  );
}
