"use client";

import { useState } from "react";
import { unstable_rethrow } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
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
    } catch (err) {
      unstable_rethrow(err);
      const message =
        err instanceof Error ? err.message : "Couldn't create poll";
      toast.error(message);
      setSubmitting(false);
    }
  }

  return (
    <form action={onSubmit} className="form-stack">
      <div className="form-field">
        <label htmlFor="title">Question</label>
        <input
          id="title"
          name="title"
          required
          maxLength={200}
          placeholder="Should we add a Saturday tournament?"
          className="form-input"
        />
      </div>

      <div className="form-field">
        <label htmlFor="description">Context (optional)</label>
        <textarea
          id="description"
          name="description"
          maxLength={2000}
          placeholder="Any details members should know before voting…"
          rows={3}
          className="form-textarea"
        />
      </div>

      <div className="form-field">
        <label>Options</label>
        <div style={{ display: "grid", gap: 8 }}>
          {options.map((value, i) => (
            <div key={i} className="form-field-row">
              <input
                name="options"
                value={value}
                onChange={(e) => updateOption(i, e.target.value)}
                required
                maxLength={200}
                placeholder={`Option ${i + 1}`}
                className="form-input"
              />
              <button
                type="button"
                disabled={options.length <= 2}
                onClick={() => removeOption(i)}
                aria-label={`Remove option ${i + 1}`}
                className="btn btn-ghost btn-sm"
                style={{ padding: "0 10px", height: 40 }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addOption}
          disabled={options.length >= 10}
          className="btn btn-ghost btn-sm"
          style={{ alignSelf: "flex-start", marginTop: 2 }}
        >
          <Plus size={14} />
          Add option
        </button>
        <p className="form-help">Between 2 and 10 options.</p>
      </div>

      <div className="form-field">
        <label htmlFor="closesAt">Close date (optional)</label>
        <input
          id="closesAt"
          name="closesAt"
          type="datetime-local"
          className="form-input"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary"
        style={{ width: "100%" }}
      >
        {submitting ? "Creating…" : "Create poll"}
      </button>
    </form>
  );
}
