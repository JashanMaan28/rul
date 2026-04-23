"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { subscribeToNotify } from "./_actions";

export function NotifyForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    const result = await subscribeToNotify({ email, topic: "leaderboard" });
    if (result.ok) {
      toast.success("You're on the list.", {
        description: "We'll ping you when the leaderboard goes live.",
      });
      setEmail("");
    } else {
      toast.error(result.error);
    }
    setSubmitting(false);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-md flex-col items-stretch gap-2 sm:flex-row"
    >
      <Input
        type="email"
        required
        placeholder="you@riponhs.example"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email for launch notification"
      />
      <Button type="submit" disabled={submitting}>
        {submitting ? "Saving…" : "Notify me"}
      </Button>
    </form>
  );
}
