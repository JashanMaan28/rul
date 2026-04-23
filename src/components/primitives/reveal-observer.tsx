"use client";

import { useEffect } from "react";
import { useReducedMotion } from "~/hooks/use-reduced-motion";

const SELECTOR = ".reveal:not(.in), .reveal-stagger:not(.in)";

export function RevealObserver() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      document
        .querySelectorAll<HTMLElement>(".reveal, .reveal-stagger")
        .forEach((el) => el.classList.add("in"));
      return;
    }

    const reveal = (el: Element) => el.classList.add("in");

    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries, obs) => {
              for (const e of entries) {
                if (e.isIntersecting) {
                  reveal(e.target);
                  obs.unobserve(e.target);
                }
              }
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
          )
        : null;

    const scan = () =>
      document.querySelectorAll(SELECTOR).forEach((el) => io?.observe(el));

    const forceShowAll = () => {
      const targets = document.querySelectorAll<HTMLElement>(
        ".reveal:not(.in), .reveal-stagger:not(.in)",
      );
      for (const el of targets) {
        el.classList.add("in");
        el.style.transition = "none";
        el.style.opacity = "1";
        el.style.transform = "none";
        io?.unobserve(el);
        if (el.classList.contains("reveal-stagger")) {
          for (const child of Array.from(el.children) as HTMLElement[]) {
            child.style.transition = "none";
            child.style.opacity = "1";
            child.style.transform = "none";
          }
        }
      }
    };

    const raf = requestAnimationFrame(scan);
    const rescan = window.setTimeout(scan, 80);
    const fallback = window.setTimeout(forceShowAll, 500);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(rescan);
      window.clearTimeout(fallback);
      io?.disconnect();
    };
  }, [reduced]);

  return null;
}
