"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "~/components/ui/progress";
import { cn } from "~/lib/utils";
import { castVote } from "../_actions";

type Option = { id: string; label: string; votes: number };

type Props = {
  pollId: string;
  options: Option[];
  totalVotes: number;
  myVote: string | null;
  disabled: boolean;
  signedIn: boolean;
};

export function VoteForm({
  pollId,
  options,
  totalVotes,
  myVote,
  disabled,
  signedIn,
}: Props) {
  const [pending, startTransition] = useTransition();
  const hasVoted = !!myVote;

  function onSelect(optionId: string) {
    if (disabled || pending || hasVoted) return;
    const option = options.find((o) => o.id === optionId);
    const ok = window.confirm(
      `Vote for "${option?.label ?? "this option"}"?\n\nVotes are final — you won't be able to change or remove it later.`,
    );
    if (!ok) return;
    startTransition(async () => {
      const result = await castVote({ pollId, pollOptionId: optionId });
      if (!result.ok) {
        toast.error(result.error ?? "Couldn't save vote");
      } else {
        toast.success("Vote recorded");
      }
    });
  }

  if (!signedIn) {
    return (
      <div className="space-y-4">
        {options.map((opt) => (
          <OptionRow
            key={opt.id}
            option={opt}
            totalVotes={totalVotes}
            showBar
          />
        ))}
        <div className="text-muted-foreground rounded-lg border border-dashed p-4 text-center text-sm">
          <Link href="/sign-in" className="underline">
            Sign in
          </Link>{" "}
          to cast a vote.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {options.map((opt) => {
        const picked = opt.id === myVote;
        const locked = disabled || hasVoted;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            disabled={locked || pending}
            className={cn(
              "bg-card flex w-full flex-col gap-2 rounded-xl border p-4 text-left transition-all",
              !locked && "hover:-translate-y-0.5 hover:shadow-md",
              picked &&
                "border-[color:var(--uno-blue)] ring-2 ring-[color:var(--uno-blue)]/40",
              locked && "opacity-80",
            )}
            aria-pressed={picked}
          >
            <OptionRow
              option={opt}
              totalVotes={totalVotes}
              picked={picked}
              showBar
            />
          </button>
        );
      })}
      {disabled ? (
        <p className="text-muted-foreground text-center text-xs">
          Voting is closed. Results are final.
        </p>
      ) : hasVoted ? (
        <p className="text-muted-foreground text-center text-xs">
          Your vote is locked in. Votes can&apos;t be changed once submitted.
        </p>
      ) : (
        <p className="text-muted-foreground text-center text-xs">
          Tap an option to vote. Votes are final — you can&apos;t change them
          later.
        </p>
      )}
    </div>
  );
}

function OptionRow({
  option,
  totalVotes,
  picked,
  showBar,
}: {
  option: Option;
  totalVotes: number;
  picked?: boolean;
  showBar?: boolean;
}) {
  const pct =
    totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
  return (
    <>
      <div className="flex w-full items-center justify-between gap-3">
        <span className="flex items-center gap-2 font-medium">
          {picked ? (
            <Check className="size-4 text-[color:var(--uno-blue)]" />
          ) : null}
          {option.label}
        </span>
        <span className="text-muted-foreground text-sm tabular-nums">
          {option.votes} · {pct}%
        </span>
      </div>
      {showBar ? <Progress value={pct} className="h-2" /> : null}
    </>
  );
}
