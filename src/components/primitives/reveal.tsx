import type { CSSProperties, ElementType, ReactNode } from "react";
import { cn } from "~/lib/utils";

export function Reveal({
  as: As = "div",
  stagger = false,
  className,
  children,
  style,
}: {
  as?: ElementType;
  stagger?: boolean;
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <As
      className={cn(stagger ? "reveal-stagger" : "reveal", className)}
      style={style}
    >
      {children}
    </As>
  );
}
