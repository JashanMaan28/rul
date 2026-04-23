import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type ComingSoonProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
};

export function ComingSoon({
  title,
  description,
  children,
  backHref = "/",
  backLabel = "Back to home",
}: ComingSoonProps) {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-16rem)] w-full max-w-4xl flex-col items-center justify-center gap-8 px-4 py-16 text-center sm:px-6">
      <div className="space-y-3">
        <div className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
          Coming soon
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="text-muted-foreground mx-auto max-w-xl">{description}</p>
      </div>
      {children}
      <Link
        href={backHref}
        className={cn(buttonVariants({ variant: "ghost" }))}
      >
        <ArrowLeft className="mr-1 size-4" />
        {backLabel}
      </Link>
    </section>
  );
}
