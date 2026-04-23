"use client";

import {
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useRef,
} from "react";
import { cn } from "~/lib/utils";

type SpotlightProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  className?: string;
  children?: ReactNode;
  tilt?: boolean;
};

export function Spotlight({
  as: As = "div",
  className,
  children,
  tilt = true,
  ...rest
}: SpotlightProps) {
  const ref = useRef<HTMLElement | null>(null);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      el.style.setProperty("--mx", `${mx}px`);
      el.style.setProperty("--my", `${my}px`);
      if (tilt) {
        const rx = (my / r.height - 0.5) * -6;
        const ry = (mx / r.width - 0.5) * 6;
        el.style.setProperty("--rx", `${rx}deg`);
        el.style.setProperty("--ry", `${ry}deg`);
      }
    },
    [tilt],
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el || !tilt) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }, [tilt]);

  return (
    <As
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn("spotlight", className)}
      {...rest}
    >
      {children}
    </As>
  );
}
