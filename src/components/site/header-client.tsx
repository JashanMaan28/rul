"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Show, SignInButton, UserButton, useClerk } from "@clerk/nextjs";
import { ArrowRight, CircleUser } from "lucide-react";
import { cn } from "~/lib/utils";
import { RulMark } from "~/components/brand/rul-mark";
import { SignUpTrigger } from "~/components/site/sign-up-trigger";
import { AnimatedThemeToggler } from "~/components/ui/animated-theme-toggler";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavBody,
  NavItems,
  Navbar,
} from "~/components/ui/resizable-navbar";

type NavLink = { label: string; href: string };

export function HeaderClient({
  navLinks,
  showAdmin,
}: {
  navLinks: NavLink[];
  showAdmin: boolean;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openSignIn, openSignUp } = useClerk();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const items = navLinks.map((link) => ({
    name: link.label,
    link: link.href,
    isActive: isActive(link.href),
  }));

  return (
    <Navbar>
      <NavBody>
        <Logo />
        <NavItems items={items} />
        <div className="relative z-20 flex items-center gap-2">
          {showAdmin ? (
            <Link
              href="/admin"
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-semibold text-[var(--uno-red)] transition-colors hover:bg-[color-mix(in_srgb,var(--uno-red)_12%,transparent)]",
                isActive("/admin") &&
                  "bg-[color-mix(in_srgb,var(--uno-red)_12%,transparent)]",
              )}
            >
              Admin
            </Link>
          ) : null}
          <AnimatedThemeToggler className="inline-flex size-8 items-center justify-center rounded-full border border-transparent text-[var(--text-2)] transition-colors hover:border-[var(--border)] hover:bg-[var(--surface)] hover:text-[var(--text)]" />
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button type="button" className="nav-btn-ghost hidden xl:inline-flex">
                Sign in
              </button>
            </SignInButton>
            <SignUpTrigger
              type="button"
              className="nav-btn-primary hidden xl:inline-flex"
            >
              <span>Join club</span>
              <ArrowRight size={13} strokeWidth={2.5} aria-hidden />
            </SignUpTrigger>
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Account"
                className="inline-flex size-8 items-center justify-center rounded-full border border-transparent text-[var(--text-2)] transition-colors hover:border-[var(--border)] hover:bg-[var(--surface)] hover:text-[var(--text)] xl:hidden"
              >
                <CircleUser size={18} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="w-44">
                <DropdownMenuItem onClick={() => openSignIn({})}>
                  Sign in
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openSignUp({})}>
                  <span>Join club</span>
                  <ArrowRight size={13} strokeWidth={2.5} className="ml-auto" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Show>
          <Show when="signed-in">
            <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} />
          </Show>
        </div>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <Logo />
          <div className="flex items-center gap-1">
            <AnimatedThemeToggler className="inline-flex size-8 items-center justify-center rounded-full border border-transparent text-[var(--text-2)] transition-colors hover:border-[var(--border)] hover:bg-[var(--surface)] hover:text-[var(--text)]" />
            <MobileNavToggle
              isOpen={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            />
          </div>
        </MobileNavHeader>

        <MobileNavMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "w-full rounded-lg px-3 py-2.5 text-sm text-[var(--text-2)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text)]",
                isActive(link.href) && "bg-[var(--surface)] text-[var(--text)]",
              )}
            >
              {link.label}
            </Link>
          ))}
          {showAdmin ? (
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="w-full rounded-lg px-3 py-2.5 text-sm font-semibold text-[var(--uno-red)] transition-colors hover:bg-[color-mix(in_srgb,var(--uno-red)_10%,transparent)]"
            >
              Admin
            </Link>
          ) : null}
          <div className="mt-3 flex w-full flex-col gap-2 border-t border-[var(--border)] pt-3">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg border border-[var(--border)] px-3 py-2 text-center text-sm text-[var(--text-2)] hover:text-[var(--text)]"
                >
                  Sign in
                </button>
              </SignInButton>
              <SignUpTrigger
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-center text-sm font-medium"
                style={{ background: "var(--text)", color: "var(--bg)" }}
              >
                Join club
              </SignUpTrigger>
            </Show>
            <Show when="signed-in">
              <div className="flex justify-center py-2">
                <UserButton />
              </div>
            </Show>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}

function Logo() {
  return (
    <Link
      href="/"
      aria-label="Ripon Uno League home"
      className="relative z-20 inline-flex items-center gap-2 rounded-md px-2 py-1"
    >
      <RulMark />
      <span className="hidden text-sm font-semibold tracking-tight text-[var(--text)] sm:inline">
        Ripon Uno League
      </span>
    </Link>
  );
}
