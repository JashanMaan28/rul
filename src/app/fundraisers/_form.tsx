"use client";

import { useState } from "react";
import { unstable_rethrow } from "next/navigation";
import { toast } from "sonner";
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
    <form action={onSubmit} className="form-stack">
      <div className="form-field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          required
          maxLength={200}
          defaultValue={defaults?.title ?? ""}
          placeholder="Blank UNO card wall — $1 per card"
          className="form-input"
        />
      </div>

      <div className="form-field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          required
          maxLength={4000}
          rows={8}
          defaultValue={defaults?.description ?? ""}
          placeholder="What's the fundraiser, where does the money go, how do people contribute?"
          className="form-textarea"
        />
      </div>

      <div className="form-field">
        <label htmlFor="goalDollars">Goal (USD, optional)</label>
        <input
          id="goalDollars"
          name="goalDollars"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          defaultValue={defaults?.goalDollars ?? ""}
          placeholder="500"
          className="form-input"
        />
      </div>

      <div className="form-grid-2">
        <div className="form-field">
          <label htmlFor="startsAt">Starts (optional)</label>
          <input
            id="startsAt"
            name="startsAt"
            type="datetime-local"
            defaultValue={defaults?.startsAt ?? ""}
            className="form-input"
          />
        </div>
        <div className="form-field">
          <label htmlFor="endsAt">Ends (optional)</label>
          <input
            id="endsAt"
            name="endsAt"
            type="datetime-local"
            defaultValue={defaults?.endsAt ?? ""}
            className="form-input"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary"
        style={{ width: "100%" }}
      >
        {submitting
          ? "Saving…"
          : props.mode === "edit"
            ? "Save changes"
            : "Launch fundraiser"}
      </button>
    </form>
  );
}
