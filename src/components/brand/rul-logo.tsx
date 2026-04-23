import { cn } from "~/lib/utils";

type RulLogoProps = {
  className?: string;
  /** Pixel height; width scales proportionally. */
  size?: number;
  /** Hides the hover tilt so the logo sits flat in dense layouts. */
  static?: boolean;
};

export function RulLogo({
  className,
  size = 40,
  static: isStatic,
}: RulLogoProps) {
  const width = size * 2;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 100"
      width={width}
      height={size}
      role="img"
      aria-label="Ripon Uno League"
      className={cn(
        "shrink-0 drop-shadow-[0_2px_0_var(--uno-ink)]",
        !isStatic && "transition-transform hover:-rotate-3",
        className,
      )}
    >
      <defs>
        <radialGradient id="rul-oval" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="oklch(0.74 0.23 25)" />
          <stop offset="100%" stopColor="oklch(0.55 0.23 25)" />
        </radialGradient>
      </defs>
      <ellipse
        cx="100"
        cy="50"
        rx="92"
        ry="42"
        fill="url(#rul-oval)"
        stroke="var(--uno-ink)"
        strokeWidth="5"
      />
      <text
        x="100"
        y="66"
        textAnchor="middle"
        fontFamily="var(--font-sans)"
        fontSize="54"
        fontStyle="italic"
        fontWeight="900"
        fill="var(--uno-yellow)"
        stroke="var(--uno-ink)"
        strokeWidth="3"
        paintOrder="stroke"
      >
        RUL
      </text>
    </svg>
  );
}
