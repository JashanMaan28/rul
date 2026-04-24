"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "~/hooks/use-reduced-motion";

type FloatCard = {
  color: "red" | "yellow" | "green" | "blue";
  label: string;
  top: string;
  left: string;
  rot: number;
  size: number;
  dur: number;
  delay: number;
  depth: number;
};

const FLOAT_CARDS: FloatCard[] = [
  {
    color: "red",
    label: "+4",
    top: "14%",
    left: "22%",
    rot: -14,
    size: 1.1,
    dur: 14,
    delay: 0,
    depth: 1.0,
  },
  {
    color: "yellow",
    label: "7",
    top: "22%",
    left: "74%",
    rot: 18,
    size: 1.0,
    dur: 17,
    delay: 0.8,
    depth: 0.7,
  },
  {
    color: "blue",
    label: "↺",
    top: "62%",
    left: "26%",
    rot: 10,
    size: 0.9,
    dur: 13,
    delay: 1.4,
    depth: 0.8,
  },
  {
    color: "green",
    label: "+2",
    top: "66%",
    left: "72%",
    rot: -8,
    size: 1.15,
    dur: 16,
    delay: 0.3,
    depth: 1.1,
  },
  {
    color: "red",
    label: "⊘",
    top: "44%",
    left: "80%",
    rot: 22,
    size: 0.8,
    dur: 12,
    delay: 2.0,
    depth: 0.5,
  },
  {
    color: "yellow",
    label: "W",
    top: "78%",
    left: "48%",
    rot: -18,
    size: 0.95,
    dur: 15,
    delay: 1.1,
    depth: 0.9,
  },
  {
    color: "green",
    label: "3",
    top: "10%",
    left: "52%",
    rot: 6,
    size: 0.75,
    dur: 18,
    delay: 0.5,
    depth: 0.4,
  },
  {
    color: "blue",
    label: "+4",
    top: "40%",
    left: "18%",
    rot: -22,
    size: 0.85,
    dur: 14,
    delay: 1.7,
    depth: 0.6,
  },
];

const COLOR_VAR = {
  red: "var(--uno-red)",
  yellow: "var(--uno-yellow)",
  green: "var(--uno-green)",
  blue: "var(--uno-blue)",
} as const;

type Placement = { top: string; left: string; rot: number };

function shufflePlacements(cards: FloatCard[]): Placement[] {
  const placements: Placement[] = cards.map((c) => ({
    top: c.top,
    left: c.left,
    rot: c.rot,
  }));
  for (let i = placements.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const ph = placements[i]!;
    placements[i] = placements[j]!;
    placements[j] = ph;
  }
  return placements.map((p) => ({
    ...p,
    rot: p.rot + (Math.random() * 24 - 12),
  }));
}

export function HeroBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const initialPlacements = useMemo<Placement[]>(
    () => FLOAT_CARDS.map((c) => ({ top: c.top, left: c.left, rot: c.rot })),
    [],
  );
  const [placements, setPlacements] = useState<Placement[]>(initialPlacements);
  const [shuffling, setShuffling] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      el.style.setProperty("--px", `${x}px`);
      el.style.setProperty("--py", `${y}px`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced]);

  const shuffle = useCallback(() => {
    setPlacements((prev) =>
      shufflePlacements(FLOAT_CARDS.map((c, i) => ({ ...c, ...prev[i]! }))),
    );
    setShuffling(true);
    window.setTimeout(() => setShuffling(false), 900);
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
    >
      <div className="grid-bg" />
      <div
        className="aurora"
        style={{ transform: "translate(var(--px,0), var(--py,0))" }}
      />

      <div className="float-cards" data-shuffling={shuffling ? "" : undefined}>
        {FLOAT_CARDS.map((c, i) => {
          const p = placements[i]!;
          return (
            <span
              key={i}
              className="float-card-wrap"
              style={{
                top: p.top,
                left: p.left,
                transform: `translate(calc(var(--px,0px) * ${c.depth}), calc(var(--py,0px) * ${c.depth}))`,
              }}
            >
              <button
                type="button"
                onClick={shuffle}
                aria-hidden="true"
                tabIndex={-1}
                className="float-card"
                style={{
                  background: COLOR_VAR[c.color],
                  ["--rot" as string]: `${p.rot}deg`,
                  ["--size" as string]: c.size,
                  animation: reduced
                    ? undefined
                    : `float-drift ${c.dur}s ease-in-out ${c.delay}s infinite alternate`,
                }}
              >
                <span>{c.label}</span>
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
}
