"use client";

import { useClerk } from "@clerk/nextjs";
import type { ComponentPropsWithoutRef, MouseEvent } from "react";

export function SignUpTrigger({
  children,
  onClick,
  ...props
}: ComponentPropsWithoutRef<"button">) {
  const { openSignUp } = useClerk();

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    openSignUp({});
  }

  return (
    <button {...props} onClick={handleClick}>
      {children}
    </button>
  );
}
