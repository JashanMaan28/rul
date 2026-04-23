import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "~/server/db";
import { getCurrentUser } from "~/lib/user";
import { can } from "~/lib/roles";
import { Eyebrow, Section } from "~/components/primitives";
import { FundraiserForm } from "../../_form";

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
    <Section accent="yellow">
      <div className="container-page" style={{ maxWidth: 720 }}>
        <Link href={`/fundraisers/${fundraiser.id}`} className="back-link">
          <ArrowLeft size={12} />
          Cancel
        </Link>
        <div className="page-head" style={{ marginBottom: 22 }}>
          <div>
            <Eyebrow>Edit fundraiser</Eyebrow>
            <h1>{fundraiser.title}</h1>
            <p className="sub" style={{ marginTop: 10 }}>
              Changes are live immediately.
            </p>
          </div>
        </div>
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
      </div>
    </Section>
  );
}
