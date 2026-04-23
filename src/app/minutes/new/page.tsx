import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "~/lib/user";
import { can } from "~/lib/roles";
import { MinutesForm } from "../_form";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export const metadata = { title: "New minutes" };

function defaultMeetingAt(): string {
  // Next Wednesday at 5:00 PM local time.
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
    <section className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <Link
        href="/minutes"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-4")}
      >
        <ArrowLeft className="mr-1 size-4" />
        Back to minutes
      </Link>
      <h1 className="text-3xl font-bold tracking-tight">New meeting minutes</h1>
      <p className="text-muted-foreground mb-6 text-sm">
        Agenda, decisions, attendance — whatever the club needs to remember.
      </p>
      <MinutesForm
        mode="create"
        defaults={{ meetingAt: defaultMeetingAt(), isPublished: true }}
      />
    </section>
  );
}
