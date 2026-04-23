import type { CSSProperties, ReactNode } from "react";

export type UnoColor = "red" | "yellow" | "green" | "blue" | "black";

const PALETTE: Record<UnoColor, string> = {
  red: "var(--uno-red)",
  yellow: "var(--uno-yellow)",
  green: "var(--uno-green)",
  blue: "var(--uno-blue)",
  black: "var(--uno-ink)",
};

export function MiniCard({
  color = "red",
  label,
  size = 1,
}: {
  color?: UnoColor;
  label?: ReactNode;
  size?: number;
}) {
  const bg = PALETTE[color];
  const style: CSSProperties =
    size !== 1
      ? { width: 44 * size, height: 62 * size, fontSize: 18 * size }
      : {};
  return (
    <span className="mini-card" style={{ background: bg, ...style }}>
      <span>{label}</span>
    </span>
  );
}
