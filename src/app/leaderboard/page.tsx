import type { Metadata } from "next";
import { Trophy } from "lucide-react";
import { ComingSoon } from "~/components/site/coming-soon";
import { NotifyForm } from "./notify-form";
import { cn } from "~/lib/utils";

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "Top RUL players by monthly and all-time trophies. Launching once the first community games are recorded.",
};

export default function LeaderboardPage() {
  return (
    <ComingSoon
      title="Leaderboard — stacking soon."
      description="Silver trophies for community session wins, gold for pro sessions. Monthly leaderboard resets on the 1st for prizes; all-time sticks around for bragging rights."
    >
      <div className="flex items-end justify-center gap-6">
        <TrophyMockup tier="silver" label="Silver · community" count={0} />
        <TrophyMockup tier="gold" label="Gold · pro" count={0} elevated />
      </div>
      <NotifyForm />
    </ComingSoon>
  );
}

function TrophyMockup({
  tier,
  label,
  count,
  elevated,
}: {
  tier: "silver" | "gold";
  label: string;
  count: number;
  elevated?: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-card flex flex-col items-center gap-3 rounded-2xl border p-6",
        elevated && "-translate-y-2",
      )}
    >
      <div
        className={cn(
          "inline-flex size-20 items-center justify-center rounded-full border-4 shadow-inner",
          tier === "silver"
            ? "border-[color:var(--trophy-silver)] bg-[color:var(--trophy-silver)]/30"
            : "border-[color:var(--trophy-gold)] bg-[color:var(--trophy-gold)]/30",
        )}
      >
        <Trophy
          className={cn(
            "size-10",
            tier === "silver"
              ? "text-[color:var(--trophy-silver)]"
              : "text-[color:var(--trophy-gold)]",
          )}
        />
      </div>
      <div className="text-center">
        <div className="text-3xl font-black tabular-nums">{count}</div>
        <div className="text-muted-foreground text-xs tracking-wider uppercase">
          {label}
        </div>
      </div>
    </div>
  );
}
