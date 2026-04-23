import type { ReactNode } from "react";

type TickerItem = {
  key?: string;
  dot?: "red" | "yellow" | "green" | "blue";
  children: ReactNode;
};

/**
 * Horizontally-scrolling ticker belt. Duplicates children so the CSS
 * translateX(-50%) animation produces a seamless loop.
 */
export function Ticker({ items }: { items: TickerItem[] }) {
  const dotColor = (c?: TickerItem["dot"]) =>
    c ? `var(--uno-${c})` : "var(--text-3)";

  const renderList = (prefix: string) =>
    items.map((it, i) => (
      <span
        className="ticker-item"
        key={`${prefix}-${it.key ?? i}`}
        aria-hidden={prefix === "b" ? true : undefined}
      >
        <span className="dot" style={{ background: dotColor(it.dot) }} />
        {it.children}
      </span>
    ));

  return (
    <div className="ticker" role="marquee" aria-label="Live league ticker">
      <div className="ticker-track">
        {renderList("a")}
        {renderList("b")}
      </div>
    </div>
  );
}
