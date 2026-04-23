import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "~/server/db";
import { getCurrentUser } from "~/lib/user";
import { can } from "~/lib/roles";
import { FundraiserForm } from "../../_form";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export const metadata = { title: "Edit fundraiser" };

function toDatetimeLocal(date: Date | null): string {
  if (!date) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default async function EditFundraiserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || !can(user.roles, "manage_fundraisers")) notFound();

  const fundraiser = await db.fundraiser.findUnique({ where: { id } });
  if (!fundraiser) notFound();

  return (
    <section className="mx-auto w-full max-w-xl px-4 py-12 sm:px-6">
      <Link
        href={`/fundraisers/${fundraiser.id}`}
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-4")}
      >
        <ArrowLeft className="mr-1 size-4" />
        Cancel
      </Link>
      <h1 className="text-3xl font-bold tracking-tight">Edit fundraiser</h1>
      <p className="text-muted-foreground mb-6 text-sm">
        Changes are live immediately.
      </p>
      <FundraiserForm
        mode="edit"
        fundraiserId={fundraiser.id}
        defaults={{
          title: fundraiser.title,
          description: fundraiser.description,
          goalDollars:
            fundraiser.goalCents != null
              ? String(fundraiser.goalCents / 100)
              : "",
          startsAt: toDatetimeLocal(fundraiser.startsAt),
          endsAt: toDatetimeLocal(fundraiser.endsAt),
        }}
      />
    </section>
  );
}
