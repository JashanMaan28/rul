"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MenuIcon } from "lucide-react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { cn } from "~/lib/utils";
import { RulMark } from "~/components/brand/rul-mark";
import { useScroll } from "~/hooks/use-scroll";
import { ThemeToggle } from "~/components/site/theme-toggle";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

type NavLink = { label: string; href: string };

export function HeaderClient({
  navLinks,
  showAdmin,
}: {
  navLinks: NavLink[];
  showAdmin: boolean;
}) {
  const scrolled = useScroll(8);
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-[background-color,backdrop-filter,border-color] duration-200",
        scrolled
          ? "border-b border-[var(--border)] bg-[var(--bg)]/75 backdrop-blur-md supports-[backdrop-filter]:bg-[var(--bg)]/60"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-14 w-full max-w-[1200px] items-center justify-between px-4 sm:px-7"
      >
        <Link
          href="/"
          aria-label="Ripon Uno League home"
          className="inline-flex items-center gap-2 rounded-md py-1 pr-2"
        >
          <RulMark />
          <span className="hidden text-sm font-semibold tracking-tight text-[var(--text)] sm:inline">
            Ripon Uno League
          </span>
        </Link>

        <ul className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-[var(--text-2)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text)]",
                  isActive(link.href) &&
                    "bg-[var(--surface)] text-[var(--text)]",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {showAdmin ? (
            <li>
              <Link
                href="/admin"
                className="rounded-md px-3 py-2 text-sm font-semibold text-[var(--uno-red)] transition-colors hover:bg-[color-mix(in_srgb,var(--uno-red)_10%,transparent)]"
              >
                Admin
              </Link>
            </li>
          ) : null}
        </ul>

        <div className="hidden items-center gap-1 md:flex">
          <ThemeToggle />
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                type="button"
                className="inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium text-[var(--text-2)] transition-colors hover:text-[var(--text)]"
              >
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                type="button"
                className="inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium transition-[filter,transform] hover:brightness-95 active:translate-y-px"
                style={{ background: "var(--text)", color: "var(--bg)" }}
              >
                Join club
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton
              appearance={{ elements: { avatarBox: "h-8 w-8" } }}
            />
          </Show>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  className="text-[var(--text-2)] hover:text-[var(--text)]"
                />
              }
            >
              <MenuIcon className="size-4.5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full gap-0 bg-[var(--bg)] sm:max-w-xs"
            >
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-4">
                {navLinks.map((link) => (
                  <SheetClose
                    key={link.href}
                    render={
                      <Link
                        href={link.href}
                        className={cn(
                          "rounded-lg px-3 py-2.5 text-sm text-[var(--text-2)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text)]",
                          isActive(link.href) &&
                            "bg-[var(--surface)] text-[var(--text)]",
                        )}
                      />
                    }
                  >
                    {link.label}
                  </SheetClose>
                ))}
                {showAdmin ? (
                  <SheetClose
                    render={
                      <Link
                        href="/admin"
                        className="rounded-lg px-3 py-2.5 text-sm font-semibold text-[var(--uno-red)] transition-colors hover:bg-[color-mix(in_srgb,var(--uno-red)_10%,transparent)]"
                      />
                    }
                  >
                    Admin
                  </SheetClose>
                ) : null}
              </div>
              <div className="mt-auto flex flex-col gap-2 p-4">
                <Show when="signed-out">
                  <SignInButton mode="modal">
                    <button
                      onClick={() => setSheetOpen(false)}
                      className="rounded-lg border border-[var(--border)] px-3 py-2 text-center text-sm text-[var(--text-2)] hover:text-[var(--text)]"
                    >
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button
                      onClick={() => setSheetOpen(false)}
                      className="rounded-lg px-3 py-2 text-center text-sm font-medium"
                      style={{ background: "var(--text)", color: "var(--bg)" }}
                    >
                      Join club
                    </button>
                  </SignUpButton>
                </Show>
                <Show when="signed-in">
                  <div className="flex justify-center py-2">
                    <UserButton />
                  </div>
                </Show>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
