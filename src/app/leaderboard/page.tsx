import type { Metadata } from "next";
import { Trophy } from "lucide-react";
import { ComingSoon } from "~/components/site/coming-soon";
import { NotifyForm } from "./notify-form";

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
      <div className="trophy-row">
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
    <div className="trophy-mock" data-elevated={elevated ? "true" : undefined}>
      <div className="trophy-orb" data-tier={tier}>
        <Trophy size={36} />
      </div>
      <div style={{ textAlign: "center", display: "grid", gap: 4 }}>
        <div className="trophy-count">{count}</div>
        <div className="trophy-label">{label}</div>
      </div>
    </div>
  );
}
