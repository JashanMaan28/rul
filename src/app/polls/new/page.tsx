import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "~/lib/user";
import { can } from "~/lib/roles";
import { NewPollForm } from "./form";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export const metadata = {
  title: "New poll",
};

export default async function NewPollPage() {
  const user = await getCurrentUser();
  if (!user || !can(user.roles, "create_polls")) notFound();

  return (
    <section className="mx-auto w-full max-w-xl px-4 py-12 sm:px-6">
      <Link
        href="/polls"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-4")}
      >
        <ArrowLeft className="mr-1 size-4" />
        Back to polls
      </Link>
      <h1 className="text-3xl font-bold tracking-tight">Spin up a poll</h1>
      <p className="text-muted-foreground mb-6 text-sm">
        Keep options short. Members vote once; they can change their pick until
        you close it.
      </p>
      <NewPollForm />
    </section>
  );
}
