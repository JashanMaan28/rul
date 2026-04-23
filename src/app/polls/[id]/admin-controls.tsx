"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { closePoll, reopenPoll } from "../_actions";

export function PollAdminControls({
  pollId,
  isClosed,
}: {
  pollId: string;
  isClosed: boolean;
}) {
  const [pending, startTransition] = useTransition();

  function onClick() {
    startTransition(async () => {
      try {
        if (isClosed) {
          await reopenPoll(pollId);
          toast.success("Poll reopened");
        } else {
          await closePoll(pollId);
          toast.success("Poll closed");
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Action failed");
      }
    });
  }

  return (
    <Button
      variant={isClosed ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      disabled={pending}
    >
      {pending ? "Saving…" : isClosed ? "Reopen poll" : "Close poll"}
    </Button>
  );
}
