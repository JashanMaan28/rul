"use client";

import { useState } from "react";
import { toast } from "sonner";
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
    <form onSubmit={onSubmit} className="notify-form">
      <input
        type="email"
        required
        placeholder="you@riponhs.example"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email for launch notification"
        className="form-input"
      />
      <button type="submit" disabled={submitting} className="btn btn-primary">
        {submitting ? "Saving…" : "Notify me"}
      </button>
    </form>
  );
}
