"use client";

import { useTransition } from "react";
import { unstable_rethrow } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteMinutes } from "../_actions";

export function DeleteButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  function onClick() {
    if (!confirm("Delete these minutes permanently?")) return;
    startTransition(async () => {
      try {
        await deleteMinutes(id);
      } catch (err) {
        unstable_rethrow(err);
        toast.error(err instanceof Error ? err.message : "Couldn't delete");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="btn btn-danger btn-sm"
    >
      <Trash2 size={14} />
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
