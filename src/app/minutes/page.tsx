import type { Metadata } from "next";
import Link from "next/link";
import { NotebookPen, Plus } from "lucide-react";
import { db } from "~/server/db";
import { getCurrentUser } from "~/lib/user";
import { can } from "~/lib/roles";
import { buttonVariants } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

export const metadata: Metadata = {
  title: "Minutes",
  description:
    "Wednesday meeting minutes, club recaps, and immediate goals from the Secretary.",
};

const dateFmt = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

export default async function MinutesPage() {
  const currentUser = await getCurrentUser();
  const canWrite = currentUser
    ? can(currentUser.roles, "write_minutes")
    : false;

  const minutes = await db.meetingMinutes.findMany({
    where: canWrite ? undefined : { isPublished: true },
    orderBy: { meetingAt: "desc" },
    include: { author: { select: { displayName: true } } },
  });

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <div className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
            Wednesday recaps &amp; more
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Meeting minutes</h1>
          <p className="text-muted-foreground text-sm">
            What we talked about, what we decided, who showed up.
          </p>
        </div>
        {canWrite ? (
          <Link
            href="/minutes/new"
            className={cn(buttonVariants({ size: "sm" }))}
          >
            <Plus className="size-4" />
            New minutes
          </Link>
        ) : null}
      </div>

      {minutes.length === 0 ? (
        <div className="bg-muted/30 rounded-2xl border border-dashed p-12 text-center">
          <NotebookPen className="text-muted-foreground mx-auto size-10" />
          <p className="mt-3 font-medium">No minutes posted yet.</p>
          <p className="text-muted-foreground text-sm">
            {canWrite
              ? "Post the first Wednesday recap."
              : "The Secretary will post recaps here after each meeting."}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {minutes.map((m) => (
            <li key={m.id}>
              <Link
                href={`/minutes/${m.id}`}
                className="group bg-card flex items-start justify-between gap-4 rounded-2xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-lg font-semibold group-hover:underline">
                      {m.title}
                    </h2>
                    {!m.isPublished ? (
                      <Badge variant="secondary">Draft</Badge>
                    ) : null}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {dateFmt.format(m.meetingAt)} · by {m.author.displayName}
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
