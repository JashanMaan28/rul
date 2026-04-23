import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "~/server/db";
import { getCurrentUser } from "~/lib/user";
import { can } from "~/lib/roles";
import { MinutesForm } from "../../_form";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

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
    <section className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <Link
        href={`/minutes/${minutes.id}`}
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-4")}
      >
        <ArrowLeft className="mr-1 size-4" />
        Cancel
      </Link>
      <h1 className="text-3xl font-bold tracking-tight">Edit minutes</h1>
      <p className="text-muted-foreground mb-6 text-sm">
        Changes are live immediately.
      </p>
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
    </section>
  );
}
