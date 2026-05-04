"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Show } from "@clerk/nextjs";
import { SignUpTrigger } from "~/components/site/sign-up-trigger";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "~/hooks/use-reduced-motion";
import { Ticker } from "~/components/primitives";

const HeroBackdrop = dynamic(
  () => import("./_hero-backdrop").then((m) => m.HeroBackdrop),
  { ssr: false },
);

const TICKER_ITEMS = [
  {
    key: "a1",
    dot: "yellow" as const,
    children: "Constitution ratified · read at /constitution",
  },
  {
    key: "a2",
    dot: "red" as const,
    children: "Officer elections wrapped · 8 seats filled",
  },
  {
    key: "a3",
    dot: "blue" as const,
    children: "Wednesday meeting · 11:51-12:31 · Room G3",
  },
  {
    key: "a4",
    dot: "green" as const,
    children: "40+ members signed in this semester",
  },
  {
    key: "a5",
    dot: "yellow" as const,
    children: "Custom wild cards passed 17–1",
  },
  {
    key: "a6",
    dot: "red" as const,
    children: "Fundraiser wall live · signed cards inside",
  },
  {
    key: "a7",
    dot: "blue" as const,
    children: "Leaderboard launching soon · Pro invites pending",
  },
  {
    key: "a8",
    dot: "green" as const,
    children: "Mon/Tue/Thu lunch · 12:17-12:56 · Room G3",
  },
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
              <SignUpTrigger type="button" className="btn-beam">
                <span>
                  Join the league <ArrowRight size={14} />
                </span>
              </SignUpTrigger>
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
