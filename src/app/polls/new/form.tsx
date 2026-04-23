"use client";

import { useState } from "react";
import { unstable_rethrow } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { createPoll } from "../_actions";

export function NewPollForm() {
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [submitting, setSubmitting] = useState(false);

  function updateOption(i: number, value: string) {
    setOptions((prev) => prev.map((v, idx) => (idx === i ? value : v)));
  }
  function addOption() {
    setOptions((prev) => (prev.length < 10 ? [...prev, ""] : prev));
  }
  function removeOption(i: number) {
    setOptions((prev) =>
      prev.length > 2 ? prev.filter((_, idx) => idx !== i) : prev,
    );
  }

  async function onSubmit(form: FormData) {
    setSubmitting(true);
    try {
      await createPoll(form);
      // createPoll redirects on success; this only runs on error.
    } catch (err) {
      unstable_rethrow(err);
      const message =
        err instanceof Error ? err.message : "Couldn't create poll";
      toast.error(message);
      setSubmitting(false);
    }
  }

  return (
    <form action={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Question</Label>
        <Input
          id="title"
          name="title"
          required
          maxLength={200}
          placeholder="Should we add a Saturday tournament?"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Context (optional)</Label>
        <Textarea
          id="description"
          name="description"
          maxLength={2000}
          placeholder="Any details members should know before voting…"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Options</Label>
        <div className="space-y-2">
          {options.map((value, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                name="options"
                value={value}
                onChange={(e) => updateOption(i, e.target.value)}
                required
                maxLength={200}
                placeholder={`Option ${i + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={options.length <= 2}
                onClick={() => removeOption(i)}
                aria-label={`Remove option ${i + 1}`}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addOption}
          disabled={options.length >= 10}
        >
          <Plus className="size-4" />
          Add option
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="closesAt">Close date (optional)</Label>
        <Input id="closesAt" name="closesAt" type="datetime-local" />
      </div>

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Creating…" : "Create poll"}
      </Button>
    </form>
  );
}
