import { cn } from "~/lib/utils";

/**
 * Tilted card-mark logo — black card, oval highlight, R-U-L letters tinted in
 * the UNO palette. Expects `rul-mark` / `rul-mark-lg` / `rul-letters` styles
 * to exist in globals.css.
 */
export function RulMark({
  large = false,
  className,
}: {
  large?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn("rul-mark", large && "rul-mark-lg", className)}
      aria-hidden
    >
      <span className="rul-mark-inner">
        <span className="rul-oval" />
        <span className="rul-letters">
          <span style={{ color: "var(--uno-red)", transform: "rotate(-4deg)" }}>
            R
          </span>
          <span
            style={{ color: "var(--uno-yellow)", transform: "rotate(3deg)" }}
          >
            U
          </span>
          <span
            style={{ color: "var(--uno-green)", transform: "rotate(-3deg)" }}
          >
            L
          </span>
        </span>
      </span>
    </span>
  );
}
