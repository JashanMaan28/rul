"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Show, SignUpButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "~/hooks/use-reduced-motion";
import { Ticker } from "~/components/primitives";

const HeroBackdrop = dynamic(
  () => import("./_hero-backdrop").then((m) => m.HeroBackdrop),
  { ssr: false },
);

const TICKER_ITEMS = [
  { key: "a1", dot: "red" as const, children: "AJIT J. — 5 win streak" },
  { key: "a2", dot: "yellow" as const, children: "MORGAN M. — climbs to #2" },
  {
    key: "a3",
    dot: "blue" as const,
    children: "VEER D. — new stacker record (+24)",
  },
  {
    key: "a4",
    dot: "green" as const,
    children: "Seven-O Swap · this Tuesday 4PM · Rm 214",
  },
  {
    key: "a5",
    dot: "red" as const,
    children: "Pot: $187 raised for nationals",
  },
  {
    key: "a6",
    dot: "blue" as const,
    children: "LANDEN M. — Pro bracket upset",
  },
  {
    key: "a7",
    dot: "yellow" as const,
    children: "Custom wild cards passed 17–1",
  },
  { key: "a8", dot: "green" as const, children: "14 meetings this semester" },
];

export function Hero() {
  const reduced = useReducedMotion();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const t = window.setTimeout(() => setLoaded(true), 40);
    return () => window.clearTimeout(t);
  }, [reduced]);

  const introStyle = (delay: string, translate: number) =>
    reduced
      ? undefined
      : {
          opacity: loaded ? 1 : 0,
          transform: `translateY(${loaded ? 0 : translate}px)`,
          transition: `all .7s ${delay} cubic-bezier(.2,.7,.2,1)`,
        };

  return (
    <>
      <section className="hero">
        <HeroBackdrop />

        <div className="container-page hero-inner">
          <h1 style={introStyle(".2s", 18)}>
            <span className="line">Stack. Skip.</span>
            <span className="line">
              <em>Dominate.</em>
            </span>
          </h1>

          <p className="hero-sub" style={introStyle(".4s", 10)}>
            Ripon High&apos;s official UNO league. Ranked play, monthly events,
            and a wall of fundraiser cards run by students &mdash; for students.
          </p>

          <div className="hero-cta" style={introStyle(".55s", 10)}>
            <Show when="signed-out">
              <SignUpButton mode="modal">
                <button type="button" className="btn-beam">
                  <span>
                    Join the league <ArrowRight size={14} />
                  </span>
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Link href="/chat" className="btn-beam">
                <span>
                  Open chat <ArrowRight size={14} />
                </span>
              </Link>
            </Show>
            <Link href="/leaderboard" className="btn btn-primary">
              View standings
            </Link>
          </div>
        </div>
      </section>

      <Ticker items={TICKER_ITEMS} />
    </>
  );
}
