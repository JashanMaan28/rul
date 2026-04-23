"use client";

import { useState } from "react";
import { unstable_rethrow } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { createFundraiser, updateFundraiser } from "./_actions";

type Defaults = {
  title?: string;
  description?: string;
  goalDollars?: string;
  startsAt?: string;
  endsAt?: string;
};

type Props =
  | { mode: "create"; defaults?: Defaults; fundraiserId?: never }
  | { mode: "edit"; fundraiserId: string; defaults: Defaults };

export function FundraiserForm(props: Props) {
  const { defaults } = props;
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(form: FormData) {
    setSubmitting(true);
    try {
      if (props.mode === "edit") {
        await updateFundraiser(props.fundraiserId, form);
      } else {
        await createFundraiser(form);
      }
    } catch (err) {
      unstable_rethrow(err);
      const message = err instanceof Error ? err.message : "Couldn't save";
      toast.error(message);
      setSubmitting(false);
    }
  }

  return (
    <form action={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          maxLength={200}
          defaultValue={defaults?.title ?? ""}
          placeholder="Blank UNO card wall — $1 per card"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          maxLength={4000}
          rows={8}
          defaultValue={defaults?.description ?? ""}
          placeholder="What's the fundraiser, where does the money go, how do people contribute?"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="goalDollars">Goal (USD, optional)</Label>
        <Input
          id="goalDollars"
          name="goalDollars"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          defaultValue={defaults?.goalDollars ?? ""}
          placeholder="500"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startsAt">Starts (optional)</Label>
          <Input
            id="startsAt"
            name="startsAt"
            type="datetime-local"
            defaultValue={defaults?.startsAt ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endsAt">Ends (optional)</Label>
          <Input
            id="endsAt"
            name="endsAt"
            type="datetime-local"
            defaultValue={defaults?.endsAt ?? ""}
          />
        </div>
      </div>

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting
          ? "Saving…"
          : props.mode === "edit"
            ? "Save changes"
            : "Launch fundraiser"}
      </Button>
    </form>
  );
}
