import { cn } from "~/lib/utils";

export function Aurora({ className }: { className?: string }) {
  return <div aria-hidden className={cn("aurora", className)} />;
}
