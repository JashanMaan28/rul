import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { db } from "~/server/db";
import { getCurrentUser } from "~/lib/user";
import { can } from "~/lib/roles";
import { Eyebrow, Reveal, Section } from "~/components/primitives";
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
    <Section accent="green">
      <article className="container-page" style={{ maxWidth: 820 }}>
        <Link href="/minutes" className="back-link">
          <ArrowLeft size={12} />
          All minutes
        </Link>

        <div className="page-head">
          <div>
            <Eyebrow>Minutes</Eyebrow>
            <h1>{minutes.title}</h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginTop: 14,
                flexWrap: "wrap",
              }}
            >
              {!minutes.isPublished ? (
                <span className="status-chip" data-status="closed">
                  Draft
                </span>
              ) : (
                <span className="status-chip" data-status="open">
                  Published
                </span>
              )}
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--text-3)",
                  letterSpacing: "0.02em",
                }}
              >
                {dateFmt.format(minutes.meetingAt)} · by{" "}
                {minutes.author.displayName}
              </span>
            </div>
          </div>
          {canWrite ? (
            <div className="action-row">
              <Link
                href={`/minutes/${minutes.id}/edit`}
                className="btn btn-ghost btn-sm"
              >
                <Pencil size={14} />
                Edit
              </Link>
              <DeleteButton id={minutes.id} />
            </div>
          ) : null}
        </div>

        <Reveal as="div" className="prose-md">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {minutes.content}
          </ReactMarkdown>
        </Reveal>
      </article>
    </Section>
  );
}
