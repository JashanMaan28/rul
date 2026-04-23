import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "~/lib/user";
import { can } from "~/lib/roles";
import { Eyebrow, Section } from "~/components/primitives";
import { NewPollForm } from "./form";

export const metadata = {
  title: "New poll",
};

export default async function NewPollPage() {
  const user = await getCurrentUser();
  if (!user || !can(user.roles, "create_polls")) notFound();

  return (
    <Section accent="blue">
      <div className="container-page" style={{ maxWidth: 640 }}>
        <Link href="/polls" className="back-link">
          <ArrowLeft size={12} />
          Back to polls
        </Link>
        <div className="page-head" style={{ marginBottom: 22 }}>
          <div>
            <Eyebrow>New poll</Eyebrow>
            <h1>Spin up a poll.</h1>
            <p className="sub" style={{ marginTop: 10 }}>
              Keep options short. Members vote once and can&apos;t change their
              pick.
            </p>
          </div>
        </div>
        <NewPollForm />
      </div>
    </Section>
  );
}
