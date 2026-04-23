"use client";

import { useEffect, useState } from "react";

/**
 * Scroll-past-threshold flag with hysteresis so the "scrolled" state doesn't
 * flicker when the user sits right at the cutoff.
 */
export function useScroll(downThreshold: number, upThreshold?: number) {
  const [scrolled, setScrolled] = useState(false);
  const up = upThreshold ?? downThreshold / 2;

  useEffect(() => {
    const handle = () => {
      const y = window.scrollY;
      setScrolled((prev) => (prev ? y > up : y > downThreshold));
    };
    window.addEventListener("scroll", handle, { passive: true });
    handle();
    return () => window.removeEventListener("scroll", handle);
  }, [downThreshold, up]);

  return scrolled;
}
