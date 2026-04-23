import Link from "next/link";
import { RulLogo } from "~/components/brand/rul-logo";

export function Footer() {
  return (
    <footer className="border-border/60 bg-background mt-24 border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <RulLogo size={32} static />
          <div className="text-sm leading-tight">
            <div className="font-semibold">Ripon Uno League</div>
            <div className="text-muted-foreground">
              Monday–Thursday · 5–8 PM · Kissee&apos;s room
            </div>
          </div>
        </div>

        <nav className="text-muted-foreground flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link href="/leaderboard" className="hover:text-foreground">
            Leaderboard
          </Link>
          <Link href="/polls" className="hover:text-foreground">
            Vote
          </Link>
          <Link href="/minutes" className="hover:text-foreground">
            Minutes
          </Link>
          <Link href="/officers" className="hover:text-foreground">
            Officers
          </Link>
        </nav>
      </div>
    </footer>
  );
}
