"use client";

import { useState, useTransition } from "react";
import { unstable_rethrow } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  closeFundraiser,
  deleteFundraiser,
  reopenFundraiser,
  updateRaised,
} from "../_actions";

export function RaisedControls({
  id,
  raisedDollars,
  isClosed,
}: {
  id: string;
  raisedDollars: number;
  isClosed: boolean;
}) {
  const [value, setValue] = useState(String(raisedDollars));
  const [pending, startTransition] = useTransition();

  function onSaveRaised() {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0) {
      toast.error("Enter a valid dollar amount");
      return;
    }
    startTransition(async () => {
      const result = await updateRaised({ id, raisedDollars: n });
      if (result.ok) {
        toast.success("Raised amount updated");
      } else {
        toast.error(result.error ?? "Couldn't update");
      }
    });
  }

  function onToggleClosed() {
    startTransition(async () => {
      try {
        if (isClosed) await reopenFundraiser(id);
        else await closeFundraiser(id);
      } catch (err) {
        unstable_rethrow(err);
        const message = err instanceof Error ? err.message : "Failed";
        toast.error(message);
      }
    });
  }

  function onDelete() {
    if (!confirm("Delete this fundraiser? This can't be undone.")) return;
    startTransition(async () => {
      try {
        await deleteFundraiser(id);
      } catch (err) {
        unstable_rethrow(err);
        const message = err instanceof Error ? err.message : "Failed";
        toast.error(message);
      }
    });
  }

  return (
    <div className="officer-panel">
      <h3>Officer controls</h3>

      <div className="officer-panel-row">
        <div className="form-field">
          <label htmlFor="raisedDollars">Update raised ($)</label>
          <input
            id="raisedDollars"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="form-input"
          />
        </div>
        <button
          type="button"
          onClick={onSaveRaised}
          disabled={pending}
          className="btn btn-primary btn-sm"
        >
          Save amount
        </button>
      </div>

      <div className="action-row">
        <button
          type="button"
          onClick={onToggleClosed}
          disabled={pending}
          className="btn btn-ghost btn-sm"
        >
          {isClosed ? "Reopen" : "Close"}
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={pending}
          className="btn btn-danger btn-sm"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
}
