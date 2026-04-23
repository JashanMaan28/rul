import type { Metadata } from "next";
import Link from "next/link";
import { NotebookPen, Plus } from "lucide-react";
import { db } from "~/server/db";
import { getCurrentUser } from "~/lib/user";
import { can } from "~/lib/roles";
import { Eyebrow, Reveal, Section } from "~/components/primitives";

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

  const publishedCount = minutes.filter((m) => m.isPublished).length;

  return (
    <Section accent="green">
      <div className="container-page">
        <div className="page-head">
          <div>
            <Eyebrow>Wednesday recaps</Eyebrow>
            <h1>Meeting minutes.</h1>
            <p className="sub" style={{ marginTop: 10 }}>
              What we talked about, what we decided, who showed up. Markdown
              rendered · {publishedCount} published.
            </p>
          </div>
          {canWrite ? (
            <Link href="/minutes/new" className="btn btn-primary btn-sm">
              <Plus size={14} />
              New minutes
            </Link>
          ) : null}
        </div>

        {minutes.length === 0 ? (
          <div
            className="callout"
            style={{
              textAlign: "center",
              padding: "48px 24px",
              borderStyle: "dashed",
            }}
          >
            <NotebookPen
              size={28}
              style={{
                color: "var(--text-3)",
                display: "block",
                margin: "0 auto 10px",
              }}
            />
            <div style={{ fontWeight: 600, color: "var(--text)" }}>
              No minutes posted yet.
            </div>
            <div style={{ marginTop: 4 }}>
              {canWrite
                ? "Post the first Wednesday recap."
                : "The Secretary will post recaps here after each meeting."}
            </div>
          </div>
        ) : (
          <Reveal as="ul" className="poll-list" stagger>
            {minutes.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/minutes/${m.id}`}
                  className="doc-row"
                  style={{ textDecoration: "none" }}
                >
                  <div className="doc-row-main">
                    <div className="doc-row-title">
                      <h3>{m.title}</h3>
                      {!m.isPublished ? (
                        <span className="status-chip" data-status="closed">
                          Draft
                        </span>
                      ) : null}
                    </div>
                    <div className="doc-row-meta">
                      {dateFmt.format(m.meetingAt)} · by {m.author.displayName}
                    </div>
                  </div>
                  <span className="doc-row-arrow" aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            ))}
          </Reveal>
        )}
      </div>
    </Section>
  );
}
