"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
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
        toast.success(`Raised amount updated`);
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
        const message = err instanceof Error ? err.message : "Failed";
        toast.error(message);
      }
    });
  }

  return (
    <div className="bg-muted/30 mt-6 rounded-2xl border border-dashed p-5">
      <h3 className="text-muted-foreground mb-3 text-sm font-semibold tracking-widest uppercase">
        Officer controls
      </h3>

      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[160px] flex-1 space-y-1.5">
          <Label htmlFor="raisedDollars">Update raised ($)</Label>
          <Input
            id="raisedDollars"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <Button onClick={onSaveRaised} disabled={pending} size="sm">
          Save amount
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          onClick={onToggleClosed}
          disabled={pending}
          variant="outline"
          size="sm"
        >
          {isClosed ? "Reopen" : "Close"}
        </Button>
        <Button
          onClick={onDelete}
          disabled={pending}
          variant="destructive"
          size="sm"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
