import Link from "next/link";
import {
  CalendarClock,
  ClipboardList,
  Medal,
  NotebookPen,
  Trophy,
  Vote,
} from "lucide-react";
import { RulLogo } from "~/components/brand/rul-logo";
import { UnoCard } from "~/components/brand/uno-card";
import { buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { OFFICERS, ROLE_LABEL } from "~/lib/officers";
import { cn } from "~/lib/utils";

const accentClass = {
  red: "bg-[color:var(--uno-red)] text-white",
  yellow: "bg-[color:var(--uno-yellow)] text-[color:var(--uno-ink)]",
  green: "bg-[color:var(--uno-green)] text-white",
  blue: "bg-[color:var(--uno-blue)] text-white",
} as const;

const accentHoverRing = {
  red: "hover:ring-[color:var(--uno-red)]/40",
  yellow: "hover:ring-[color:var(--uno-yellow)]/60",
  green: "hover:ring-[color:var(--uno-green)]/40",
  blue: "hover:ring-[color:var(--uno-blue)]/40",
} as const;

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <ScheduleSection />
      <FeatureGrid />
      <OfficersSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          background:
            "radial-gradient(ellipse at 20% 20%, var(--uno-red), transparent 55%), radial-gradient(ellipse at 80% 30%, var(--uno-yellow), transparent 55%), radial-gradient(ellipse at 50% 90%, var(--uno-blue), transparent 60%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-4 pt-16 pb-20 text-center sm:px-6 md:pt-24">
        <Badge variant="secondary" className="tracking-widest uppercase">
          Ripon High · Est. 2026
        </Badge>
        <RulLogo size={96} />
        <div className="flex max-w-3xl flex-col gap-4">
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
            Ripon&apos;s loudest card game{" "}
            <span className="text-[color:var(--uno-red)]">gets a league.</span>
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl">
            Drop by Kissee&apos;s room Monday through Thursday, 5–8 PM. Stack
            trophies. Take someone out with a +4. Reset monthly for prizes.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/sign-up" className={cn(buttonVariants({ size: "lg" }))}>
            Join the league
          </Link>
          <Link
            href="/leaderboard"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
          >
            See the leaderboard
          </Link>
        </div>
        <div className="mt-4 flex items-end justify-center gap-[-1rem] pb-2">
          <UnoCard color="red" symbol="+4" tilt={-14} className="-mr-4" />
          <UnoCard color="yellow" symbol="9" tilt={-4} className="z-10 -mr-4" />
          <UnoCard color="green" symbol="R" tilt={4} className="z-20 -mr-4" />
          <UnoCard color="blue" symbol="S" tilt={12} className="z-30" />
        </div>
      </div>
    </section>
  );
}

function ScheduleSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="text-muted-foreground flex items-center gap-2">
              <CalendarClock className="size-4" />
              <span className="text-sm font-medium tracking-wider uppercase">
                League schedule
              </span>
            </div>
            <CardTitle className="text-2xl">
              Mon–Thu · 5–8 PM · Kissee&apos;s room
            </CardTitle>
            <CardDescription>
              Community games count toward silver trophies. Pro sessions count
              toward gold. Monthly leaderboards reset on the 1st.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {["Mon", "Tue", "Wed", "Thu"].map((day) => (
              <div
                key={day}
                className="bg-muted/30 rounded-lg border p-3 text-center"
              >
                <div className="text-muted-foreground text-xs tracking-wider uppercase">
                  {day}
                </div>
                <div className="font-semibold">5 – 8 PM</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="ring-2 ring-[color:var(--uno-yellow)]/40">
          <CardHeader>
            <div className="text-muted-foreground flex items-center gap-2">
              <NotebookPen className="size-4" />
              <span className="text-sm font-medium tracking-wider uppercase">
                Wednesday ritual
              </span>
            </div>
            <CardTitle>Club recap + goals, then UNO</CardTitle>
            <CardDescription>
              Wednesdays open with a club recap, immediate goals, and minutes.
              Then we shuffle and play.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link
              href="/minutes"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              Read the minutes →
            </Link>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}

function FeatureGrid() {
  const items = [
    {
      href: "/leaderboard",
      icon: Trophy,
      label: "Leaderboard",
      desc: "Top community & pro trophies. Monthly + all-time views.",
      accent: "red" as const,
      status: "Launching soon",
    },
    {
      href: "/polls",
      icon: Vote,
      label: "Vote on the future",
      desc: "Officers float ideas, members vote. Winners get built.",
      accent: "blue" as const,
      status: "Live · bring opinions",
    },
    {
      href: "/minutes",
      icon: ClipboardList,
      label: "Meeting minutes",
      desc: "Wednesday recaps, attendance, and club goals.",
      accent: "green" as const,
      status: "Updated weekly",
    },
    {
      href: "/archive",
      icon: Medal,
      label: "Monthly hall of fame",
      desc: "Past month winners immortalized. Trophies reset, glory doesn't.",
      accent: "yellow" as const,
      status: "First snapshot: May 1",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-12 sm:px-6">
      <div className="mb-6 flex flex-col gap-1">
        <div className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
          What lives in the app
        </div>
        <h2 className="text-3xl font-bold tracking-tight">
          Everything the club runs on.
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group bg-card relative flex h-full flex-col gap-3 rounded-xl border p-5 ring-2 ring-transparent transition-all hover:-translate-y-0.5 hover:shadow-lg",
              accentHoverRing[item.accent],
            )}
          >
            <div
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-lg",
                accentClass[item.accent],
              )}
            >
              <item.icon className="size-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold">{item.label}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </div>
            <span className="text-muted-foreground mt-auto text-xs tracking-wider uppercase">
              {item.status}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function OfficersSection() {
  return (
    <section
      className="mx-auto w-full max-w-6xl px-4 pt-16 sm:px-6"
      id="officers"
    >
      <div className="mb-6 flex flex-col gap-1">
        <div className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
          Who runs it
        </div>
        <h2 className="text-3xl font-bold tracking-tight">Officer roster.</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {OFFICERS.map((officer) => (
          <div
            key={officer.name}
            className="bg-card flex items-center gap-3 rounded-xl border p-4"
          >
            <div
              className={cn(
                "inline-flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                accentClass[officer.accent],
              )}
              aria-hidden
            >
              {officer.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div className="min-w-0">
              <div className="truncate font-semibold">{officer.name}</div>
              <div className="text-muted-foreground truncate text-xs">
                {officer.title} · {ROLE_LABEL[officer.role]}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
