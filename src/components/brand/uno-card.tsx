import { cn } from "~/lib/utils";

type UnoColor = "red" | "yellow" | "green" | "blue";

const COLOR_VAR: Record<UnoColor, string> = {
  red: "var(--uno-red)",
  yellow: "var(--uno-yellow)",
  green: "var(--uno-green)",
  blue: "var(--uno-blue)",
};

type UnoCardProps = {
  color: UnoColor;
  symbol?: string;
  className?: string;
  /** degrees of tilt */
  tilt?: number;
};

export function UnoCard({
  color,
  symbol = "UNO",
  className,
  tilt = 0,
}: UnoCardProps) {
  return (
    <div
      style={{
        backgroundColor: COLOR_VAR[color],
        transform: `rotate(${tilt}deg)`,
      }}
      className={cn(
        "relative flex aspect-[2/3] w-24 items-center justify-center rounded-xl border-4 border-[color:var(--uno-ink)] shadow-[0_8px_24px_rgba(0,0,0,0.25)]",
        className,
      )}
    >
      <span
        className="absolute inset-3 rounded-[40%] border-2 border-white/80 bg-white/15"
        aria-hidden
      />
      <span
        className="relative z-10 text-2xl font-black tracking-tight text-white italic"
        style={{
          textShadow:
            "2px 2px 0 var(--uno-ink), -2px -2px 0 var(--uno-ink), 2px -2px 0 var(--uno-ink), -2px 2px 0 var(--uno-ink)",
        }}
      >
        {symbol}
      </span>
    </div>
  );
}
