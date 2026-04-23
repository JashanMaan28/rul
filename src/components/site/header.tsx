import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { RulLogo } from "~/components/brand/rul-logo";
import { Button, buttonVariants } from "~/components/ui/button";
import { getCurrentUser } from "~/lib/user";
import { can } from "~/lib/roles";
import { cn } from "~/lib/utils";

const NAV_PUBLIC = [
  { href: "/", label: "Home" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/polls", label: "Vote" },
  { href: "/minutes", label: "Minutes" },
  { href: "/fundraisers", label: "Fundraisers" },
];

export async function Header() {
  const currentUser = await getCurrentUser();
  const showAdmin = currentUser
    ? can(currentUser.roles, "access_admin")
    : false;
  const nav = currentUser
    ? [...NAV_PUBLIC, { href: "/chat", label: "Chat" }]
    : NAV_PUBLIC;

  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <RulLogo size={32} />
          <span className="sr-only">Ripon Uno League</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {showAdmin ? (
            <Link
              href="/admin"
              className="hover:bg-muted rounded-md px-3 py-2 text-sm font-semibold text-[color:var(--uno-red)] transition-colors"
            >
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm">Join the league</Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: { avatarBox: "h-8 w-8" },
              }}
            />
          </Show>
        </div>
      </div>
    </header>
  );
}

// Re-exported so other components can build Link-as-button without importing cn everywhere.
export function linkButtonClass(
  ...args: Parameters<typeof buttonVariants>
): string {
  return cn(buttonVariants(...args));
}
