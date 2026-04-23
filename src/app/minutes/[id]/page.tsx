import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { db } from "~/server/db";
import { getCurrentUser } from "~/lib/user";
import { can } from "~/lib/roles";
import { Badge } from "~/components/ui/badge";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { DeleteButton } from "./delete-button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const minutes = await db.meetingMinutes.findUnique({
    where: { id },
    select: { title: true },
  });
  return { title: minutes?.title ?? "Minutes" };
}

const dateFmt = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

export default async function MinutesDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  const canWrite = currentUser
    ? can(currentUser.roles, "write_minutes")
    : false;

  const minutes = await db.meetingMinutes.findUnique({
    where: { id },
    include: { author: { select: { displayName: true } } },
  });

  if (!minutes) notFound();
  if (!minutes.isPublished && !canWrite) notFound();

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/minutes"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-4")}
      >
        <ArrowLeft className="mr-1 size-4" />
        All minutes
      </Link>

      <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {minutes.title}
            </h1>
            {!minutes.isPublished ? (
              <Badge variant="secondary">Draft</Badge>
            ) : null}
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            {dateFmt.format(minutes.meetingAt)} · by{" "}
            {minutes.author.displayName}
          </p>
        </div>
        {canWrite ? (
          <div className="flex items-center gap-2">
            <Link
              href={`/minutes/${minutes.id}/edit`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              <Pencil className="size-4" />
              Edit
            </Link>
            <DeleteButton id={minutes.id} />
          </div>
        ) : null}
      </header>

      <div className="prose prose-neutral bg-card dark:prose-invert max-w-none rounded-2xl border p-6 text-[15px] leading-relaxed">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {minutes.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
