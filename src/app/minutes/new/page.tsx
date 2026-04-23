import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "~/lib/user";
import { can } from "~/lib/roles";
import { Eyebrow, Section } from "~/components/primitives";
import { MinutesForm } from "../_form";

export const metadata = { title: "New minutes" };

function defaultMeetingAt(): string {
  const now = new Date();
  const day = now.getDay();
  const daysUntilWed = (3 - day + 7) % 7 || 7;
  const wed = new Date(now);
  wed.setDate(now.getDate() + daysUntilWed);
  wed.setHours(17, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${wed.getFullYear()}-${pad(wed.getMonth() + 1)}-${pad(wed.getDate())}T${pad(wed.getHours())}:${pad(wed.getMinutes())}`;
}

export default async function NewMinutesPage() {
  const user = await getCurrentUser();
  if (!user || !can(user.roles, "write_minutes")) notFound();

  return (
    <Section accent="green">
      <div className="container-page" style={{ maxWidth: 720 }}>
        <Link href="/minutes" className="back-link">
          <ArrowLeft size={12} />
          Back to minutes
        </Link>
        <div className="page-head" style={{ marginBottom: 22 }}>
          <div>
            <Eyebrow>New minutes</Eyebrow>
            <h1>Post the recap.</h1>
            <p className="sub" style={{ marginTop: 10 }}>
              Agenda, decisions, attendance — whatever the club needs to
              remember.
            </p>
          </div>
        </div>
        <MinutesForm
          mode="create"
          defaults={{ meetingAt: defaultMeetingAt(), isPublished: true }}
        />
      </div>
    </Section>
  );
}
