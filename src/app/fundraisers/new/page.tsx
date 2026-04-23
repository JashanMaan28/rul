import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "~/lib/user";
import { can } from "~/lib/roles";
import { FundraiserForm } from "../_form";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export const metadata = { title: "New fundraiser" };

export default async function NewFundraiserPage() {
  const user = await getCurrentUser();
  if (!user || !can(user.roles, "manage_fundraisers")) notFound();

  return (
    <section className="mx-auto w-full max-w-xl px-4 py-12 sm:px-6">
      <Link
        href="/fundraisers"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-4")}
      >
        <ArrowLeft className="mr-1 size-4" />
        Back to fundraisers
      </Link>
      <h1 className="text-3xl font-bold tracking-tight">Launch a fundraiser</h1>
      <p className="text-muted-foreground mb-6 text-sm">
        Set a goal if you have one. You can update raised amounts on the
        fundraiser page as money comes in.
      </p>
      <FundraiserForm mode="create" />
    </section>
  );
}
