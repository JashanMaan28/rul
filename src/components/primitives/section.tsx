import type { CSSProperties, ReactNode } from "react";
import { cn } from "~/lib/utils";

type Accent = "red" | "yellow" | "green" | "blue";

export function Section({
  id,
  className,
  children,
  style,
  accent,
  as: As = "section",
}: {
  id?: string;
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
  accent?: Accent;
  as?: "section" | "div";
}) {
  return (
    <As
      id={id}
      className={cn("section", className)}
      style={style}
      data-accent={accent}
    >
      {children}
    </As>
  );
}
