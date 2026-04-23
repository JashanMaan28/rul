import type { UnoColor } from "./mini-card";

export function Ava({
  init,
  color,
  size = 32,
}: {
  init: string;
  color?: UnoColor | null;
  size?: number;
}) {
  const bg = color
    ? `color-mix(in srgb, var(--uno-${color}) 18%, var(--surface-2))`
    : "var(--surface-2)";
  const border = color
    ? `color-mix(in srgb, var(--uno-${color}) 40%, var(--border))`
    : "var(--border)";
  return (
    <span
      className="ava-initials"
      style={{
        width: size,
        height: size,
        background: bg,
        borderColor: border,
        fontSize: Math.round(size * 0.36),
      }}
    >
      {init}
    </span>
  );
}
