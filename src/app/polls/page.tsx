import type { Metadata } from "next";
import Link from "next/link";
import { Vote as VoteIcon, Plus } from "lucide-react";
import { db } from "~/server/db";
import { getCurrentUser } from "~/lib/user";
import { can } from "~/lib/roles";
import { buttonVariants } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

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

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <div className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
            Vote on the future
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Polls from your officers
          </h1>
          <p className="text-muted-foreground text-sm">
            One vote per poll. Change your mind anytime before it closes.
          </p>
        </div>
        {canCreate ? (
          <Link
            href="/polls/new"
            className={cn(buttonVariants({ size: "sm" }))}
          >
            <Plus className="size-4" />
            New poll
          </Link>
        ) : null}
      </div>

      {polls.length === 0 ? (
        <div className="bg-muted/30 rounded-2xl border border-dashed p-12 text-center">
          <VoteIcon className="text-muted-foreground mx-auto size-10" />
          <p className="mt-3 font-medium">No polls yet.</p>
          <p className="text-muted-foreground text-sm">
            {canCreate
              ? "You can spin up the first one."
              : "Check back once officers post one."}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {polls.map((poll) => (
            <li key={poll.id}>
              <Link
                href={`/polls/${poll.id}`}
                className="group bg-card flex items-start justify-between gap-4 rounded-2xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-lg font-semibold group-hover:underline">
                      {poll.title}
                    </h2>
                    {poll.isClosed ? (
                      <Badge variant="secondary">Closed</Badge>
                    ) : (
                      <Badge
                        variant="default"
                        className="bg-[color:var(--uno-green)]"
                      >
                        Open
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    by {poll.createdBy.displayName} · {poll._count.votes} vote
                    {poll._count.votes === 1 ? "" : "s"}
                    {poll.closesAt
                      ? ` · closes ${poll.closesAt.toLocaleDateString()}`
                      : ""}
                  </p>
                </div>
                <span className="text-muted-foreground text-sm">→</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
