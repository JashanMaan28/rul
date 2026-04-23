"use client";

import Link from "next/link";
import { useTransition, type CSSProperties } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
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
    if (disabled || pending || hasVoted || !signedIn) return;
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

  const locked = disabled || hasVoted || !signedIn;

  return (
    <div>
      <div className="poll-options">
        {options.map((opt) => {
          const pct =
            totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
          const picked = opt.id === myVote;
          const style: CSSProperties = {
            ["--pct" as string]: `${pct}%`,
          };
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              disabled={locked || pending}
              className="poll-option"
              style={style}
              aria-pressed={picked}
            >
              <span className="poll-option-label">
                {picked ? (
                  <Check
                    size={16}
                    style={{ color: "var(--uno-blue)", flexShrink: 0 }}
                  />
                ) : null}
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {opt.label}
                </span>
              </span>
              <span className="poll-option-count">
                {opt.votes} · {pct}%
              </span>
            </button>
          );
        })}
      </div>

      <p
        style={{
          marginTop: 16,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--text-3)",
          textAlign: "center",
          letterSpacing: "0.04em",
        }}
      >
        {!signedIn ? (
          <>
            <Link
              href="/sign-in"
              style={{
                color: "var(--text)",
                textDecoration: "underline",
                textUnderlineOffset: 2,
              }}
            >
              Sign in
            </Link>{" "}
            to cast a vote.
          </>
        ) : disabled ? (
          "Voting is closed. Results are final."
        ) : hasVoted ? (
          "Your vote is locked in. Votes can't be changed once submitted."
        ) : (
          "Tap an option to vote. Votes are final — you can't change them later."
        )}
      </p>
    </div>
  );
}
