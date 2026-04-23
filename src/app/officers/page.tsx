import type { Metadata } from "next";
import { OFFICERS, ROLE_LABEL } from "~/lib/officers";
import { cn } from "~/lib/utils";

export const metadata: Metadata = {
  title: "Officers",
  description: "The people running Ripon Uno League.",
};

const accent = {
  red: "bg-[color:var(--uno-red)] text-white",
  yellow: "bg-[color:var(--uno-yellow)] text-[color:var(--uno-ink)]",
  green: "bg-[color:var(--uno-green)] text-white",
  blue: "bg-[color:var(--uno-blue)] text-white",
} as const;

export default function OfficersPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
      <div className="mb-10 flex flex-col gap-2 text-center">
        <div className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
          Who runs it
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Officer roster
        </h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {OFFICERS.map((officer) => (
          <div
            key={officer.name}
            className="bg-card flex items-center gap-4 rounded-2xl border p-5"
          >
            <div
              className={cn(
                "inline-flex size-14 shrink-0 items-center justify-center rounded-full text-lg font-bold",
                accent[officer.accent],
              )}
              aria-hidden
            >
              {officer.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div className="min-w-0">
              <div className="font-semibold">{officer.name}</div>
              <div className="text-muted-foreground text-sm">
                {officer.title}
              </div>
              <div className="text-muted-foreground mt-1 text-xs tracking-wider uppercase">
                {ROLE_LABEL[officer.role]}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
