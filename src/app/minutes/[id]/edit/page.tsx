import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "~/server/db";
import { getCurrentUser } from "~/lib/user";
import { can } from "~/lib/roles";
import { Eyebrow, Section } from "~/components/primitives";
import { MinutesForm } from "../../_form";

export const metadata = { title: "Edit minutes" };

function toDatetimeLocal(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default async function EditMinutesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || !can(user.roles, "write_minutes")) notFound();

  const minutes = await db.meetingMinutes.findUnique({ where: { id } });
  if (!minutes) notFound();

  return (
    <Section accent="green">
      <div className="container-page" style={{ maxWidth: 720 }}>
        <Link href={`/minutes/${minutes.id}`} className="back-link">
          <ArrowLeft size={12} />
          Cancel
        </Link>
        <div className="page-head" style={{ marginBottom: 22 }}>
          <div>
            <Eyebrow>Edit minutes</Eyebrow>
            <h1>{minutes.title}</h1>
            <p className="sub" style={{ marginTop: 10 }}>
              Changes are live immediately.
            </p>
          </div>
        </div>
        <MinutesForm
          mode="edit"
          minutesId={minutes.id}
          defaults={{
            title: minutes.title,
            content: minutes.content,
            meetingAt: toDatetimeLocal(minutes.meetingAt),
            isPublished: minutes.isPublished,
          }}
        />
      </div>
    </Section>
  );
}
