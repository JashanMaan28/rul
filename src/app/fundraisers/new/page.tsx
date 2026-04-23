import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "~/lib/user";
import { can } from "~/lib/roles";
import { Eyebrow, Section } from "~/components/primitives";
import { FundraiserForm } from "../_form";

export const metadata = { title: "New fundraiser" };

export default async function NewFundraiserPage() {
  const user = await getCurrentUser();
  if (!user || !can(user.roles, "manage_fundraisers")) notFound();

  return (
    <Section accent="yellow">
      <div className="container-page" style={{ maxWidth: 720 }}>
        <Link href="/fundraisers" className="back-link">
          <ArrowLeft size={12} />
          Back to fundraisers
        </Link>
        <div className="page-head" style={{ marginBottom: 22 }}>
          <div>
            <Eyebrow>New fundraiser</Eyebrow>
            <h1>Launch a fundraiser.</h1>
            <p className="sub" style={{ marginTop: 10 }}>
              Set a goal if you have one. You can update raised amounts on the
              fundraiser page as money comes in.
            </p>
          </div>
        </div>
        <FundraiserForm mode="create" />
      </div>
    </Section>
  );
}
