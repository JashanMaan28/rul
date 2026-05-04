import type { CSSProperties, ElementType, ReactNode } from "react";

export function Reveal({
  as: As = "div",
  stagger: _stagger,
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
  void _stagger;
  return (
    <As className={className} style={style}>
      {children}
    </As>
  );
}
