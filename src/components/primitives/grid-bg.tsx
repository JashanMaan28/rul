import { cn } from "~/lib/utils";

export function GridBG({ className }: { className?: string }) {
  return <div aria-hidden className={cn("grid-bg", className)} />;
}
