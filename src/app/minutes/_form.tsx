"use client";

import { useState } from "react";
import { unstable_rethrow } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
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
    <form action={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          maxLength={200}
          defaultValue={defaults?.title ?? ""}
          placeholder="Wednesday 5/7 — recap + goals"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="meetingAt">Meeting date &amp; time</Label>
        <Input
          id="meetingAt"
          name="meetingAt"
          type="datetime-local"
          required
          defaultValue={defaults?.meetingAt ?? ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Minutes</Label>
        <Textarea
          id="content"
          name="content"
          required
          maxLength={20000}
          rows={14}
          defaultValue={defaults?.content ?? ""}
          placeholder={`## Attendance\n- \n\n## Recap\n- \n\n## Immediate goals\n- `}
        />
        <p className="text-muted-foreground text-xs">
          Supports Markdown — headings, lists, links, **bold**, tables.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPublished"
          name="isPublished"
          defaultChecked={defaults?.isPublished ?? true}
          className="border-input size-4 rounded accent-[color:var(--uno-green)]"
        />
        <Label htmlFor="isPublished" className="text-sm">
          Publish (uncheck to save as draft)
        </Label>
      </div>

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting
          ? "Saving…"
          : props.mode === "edit"
            ? "Save changes"
            : "Post minutes"}
      </Button>
    </form>
  );
}
