"use client";

import { useState } from "react";
import { unstable_rethrow } from "next/navigation";
import { toast } from "sonner";
import { RichTextEditor } from "~/components/ui/rich-text-editor";
import { createMinutes, updateMinutes } from "./_actions";

type Defaults = {
  title?: string;
  content?: string;
  meetingAt?: string;
  isPublished?: boolean;
};

type Props =
  | { mode: "create"; defaults?: Defaults; minutesId?: never }
  | { mode: "edit"; minutesId: string; defaults: Defaults };

export function MinutesForm(props: Props) {
  const { defaults } = props;
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(form: FormData) {
    setSubmitting(true);
    try {
      if (props.mode === "edit") {
        await updateMinutes(props.minutesId, form);
      } else {
        await createMinutes(form);
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
          placeholder="Wednesday 5/7 — recap + goals"
          className="form-input"
        />
      </div>

      <div className="form-field">
        <label htmlFor="meetingAt">Meeting date &amp; time</label>
        <input
          id="meetingAt"
          name="meetingAt"
          type="datetime-local"
          required
          defaultValue={defaults?.meetingAt ?? ""}
          className="form-input"
        />
      </div>

      <div className="form-field">
        <label htmlFor="content">Minutes</label>
        <RichTextEditor
          name="content"
          defaultValue={defaults?.content ?? ""}
          placeholder="Attendance, recap, immediate goals…"
          ariaLabel="Meeting minutes body"
        />
        <p className="form-help">
          Saved as Markdown — formatting, headings, lists, links, and images
          all round-trip cleanly.
        </p>
      </div>

      <div className="check-row">
        <input
          type="checkbox"
          id="isPublished"
          name="isPublished"
          defaultChecked={defaults?.isPublished ?? true}
        />
        <label htmlFor="isPublished">Publish (uncheck to save as draft)</label>
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
            : "Post minutes"}
      </button>
    </form>
  );
}
