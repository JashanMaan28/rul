"use client";

import { useTransition } from "react";
import { unstable_rethrow } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { deleteMinutes } from "../_actions";

export function DeleteButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  function onClick() {
    if (!confirm("Delete these minutes permanently?")) return;
    startTransition(async () => {
      try {
        await deleteMinutes(id);
        // deleteMinutes redirects on success.
      } catch (err) {
        unstable_rethrow(err);
        toast.error(err instanceof Error ? err.message : "Couldn't delete");
      }
    });
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={onClick}
      disabled={pending}
    >
      <Trash2 className="size-4" />
      {pending ? "Deleting…" : "Delete"}
    </Button>
  );
}
