import Link from "next/link";
import {
  CalendarClock,
  ClipboardList,
  Gift,
  MessageSquare,
  Sparkles,
  Trophy,
  Users,
  Vote,
} from "lucide-react";
import { Show } from "@clerk/nextjs";
import { SignUpTrigger } from "~/components/site/sign-up-trigger";
import { Hero } from "./_hero";
import {
  CountUp,
  Eyebrow,
  MiniCard,
  Reveal,
  Section,
  Spotlight,
} from "~/components/primitives";
import MagicBento from "~/components/MagicBento";
import { OFFICERS, ROLE_LABEL } from "~/lib/officers";

const DAYS = ["Mon", "Tue", "Wed", "Thu"] as const;

const META_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--text-3)",
};

type ChatMsg = {
  initials: string;
  name: string;
  time: string;
  text: string;
  accent: "red" | "yellow" | "green" | "blue";
};

const CHAT_MESSAGES: ChatMsg[] = [
  {
    initials: "MM",
    name: "Morgan M.",
    time: "2m",
    text: "who's up for ranked tonight?",
    accent: "yellow",
  },
  {
    initials: "VD",
    name: "Veer D.",
    time: "1m",
    text: "bringing the stacker deck",
    accent: "blue",
  },
  {
    initials: "AJ",
    name: "Ajit J.",
    time: "now",
    text: "room 214, 5pm sharp",
    accent: "red",
  },
];

function ChatPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {CHAT_MESSAGES.map((m) => (
        <div
          key={m.name}
          style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
        >
          <span
            aria-hidden
            style={{
              flexShrink: 0,
              width: 30,
              height: 30,
              borderRadius: 999,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: "0.05em",
              background: `color-mix(in srgb, var(--uno-${m.accent}) 22%, var(--surface-2))`,
              border: `1px solid color-mix(in srgb, var(--uno-${m.accent}) 45%, var(--border))`,
              color: `color-mix(in srgb, var(--uno-${m.accent}) 85%, var(--text))`,
            }}
          >
            {m.initials}
          </span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 8,
                marginBottom: 2,
              }}
            >
              <span
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: "var(--text)",
                  letterSpacing: "-0.005em",
                }}
              >
                {m.name}
              </span>
              <span style={META_STYLE}>{m.time}</span>
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--text-2)",
                lineHeight: 1.4,
              }}
            >
              {m.text}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

type MinuteItem = { done: boolean; label: string };

const MINUTE_ITEMS: MinuteItem[] = [
  { done: true, label: "Attendance · 18 of 22" },
  { done: true, label: "Nationals travel budget" },
  { done: false, label: "Custom wild cards vote" },
  { done: false, label: "Seven-O Swap bracket" },
];

function MinutesPreview() {
  const done = MINUTE_ITEMS.filter((i) => i.done).length;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "14px 16px",
        borderRadius: 14,
        border: "1px solid var(--border)",
        background:
          "linear-gradient(180deg, var(--surface-2) 0%, color-mix(in srgb, var(--surface) 80%, var(--surface-2)) 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: 10,
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span style={META_STYLE}>Wed · Apr 23</span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10.5,
            letterSpacing: "0.08em",
            color: "var(--text-2)",
          }}
        >
          {done} / {MINUTE_ITEMS.length}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {MINUTE_ITEMS.map((it) => (
          <div
            key={it.label}
            style={{
              display: "flex",
              gap: 11,
              alignItems: "center",
              fontSize: 13,
              color: it.done ? "var(--text-3)" : "var(--text)",
            }}
          >
            <span
              aria-hidden
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 16,
                height: 16,
                borderRadius: 5,
                flexShrink: 0,
                background: it.done
                  ? "color-mix(in srgb, var(--uno-green) 32%, var(--surface))"
                  : "var(--surface)",
                border: `1px solid ${
                  it.done
                    ? "color-mix(in srgb, var(--uno-green) 60%, var(--border))"
                    : "var(--border-strong)"
                }`,
                color: "var(--uno-green)",
                fontSize: 10,
                lineHeight: 1,
              }}
            >
              {it.done ? "✓" : ""}
            </span>
            <span>{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="page-enter">
      <Hero />

      <Section accent="blue">
        <div className="container-page">
          <div className="section-head">
            <div>
              <Eyebrow>The League</Eyebrow>
              <h2 className="heading-2">What the club gives you.</h2>
            </div>
            <p className="sub muted">
              Built for players, run by officers. Every feature below is a
              reason to keep the app open during lunch.
            </p>
          </div>

          <MagicBento
            textAutoHide={true}
            enableStars
            enableSpotlight
            enableBorderGlow={true}
            enableTilt={true}
            enableMagnetism={true}
            clickEffect
            spotlightRadius={400}
            particleCount={12}
            glowColor="59, 130, 246"
            disableAnimations={false}
            cardData={[
              {
                label: "Ranked play",
                accent: "yellow",
                icon: <Trophy size={18} />,
                title: "Two leaderboards, one system",
                description:
                  "Every logged game feeds your rank. Community is open to all members; Pro is invite-only and resets each month.",
                footer: (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <MiniCard color="red" label="+4" />
                      <MiniCard color="yellow" label="7" />
                      <MiniCard color="green" label="0" />
                      <MiniCard color="blue" label="+2" />
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "var(--text-3)",
                      }}
                    >
                      Launch pending — see{" "}
                      <Link
                        href="/leaderboard"
                        style={{
                          color: "var(--text-2)",
                          textDecoration: "underline",
                        }}
                      >
                        standings
                      </Link>
                    </div>
                  </div>
                ),
              },
              {
                label: "Vote",
                accent: "red",
                icon: <Vote size={18} />,
                title: "Officers float ideas. Members decide.",
                description:
                  "Live polls for custom rules, event picks, and gamemode rotations. Winners get built into the next session.",
              },
              {
                label: "Community chat",
                accent: "blue",
                icon: <MessageSquare size={18} />,
                title: "#general, anytime",
                description:
                  "Find a game in minutes. Channels for strategy, rules, brackets, memes — with an officer DM lane for moderation.",
                preview: <ChatPreview />,
              },
              {
                accent: "green",
                icon: <ClipboardList size={18} />,
                title: "Meeting minutes",
                description:
                  "Wednesday recaps, attendance, and club goals — in Markdown.",
                preview: <MinutesPreview />,
              },
              {
                accent: "red",
                icon: <Gift size={18} />,
                title: "Fundraiser wall",
                description:
                  "Student-signed cards fund nationals travel and prize packs.",
              },
              {
                accent: "blue",
                icon: <Users size={18} />,
                title: (
                  <>
                    <CountUp to={40} />+ members
                  </>
                ),
                description: (
                  <>
                    Officers, reps, rookies. New this semester:{" "}
                    <CountUp to={22} />.
                  </>
                ),
              },
            ]}
          />
        </div>
      </Section>

      <Section accent="yellow" style={{ background: "var(--bg-raise)" }}>
        <div className="container-page">
          <div className="section-head">
            <div>
              <Eyebrow>Schedule</Eyebrow>
              <h2 className="heading-2">Mon–Thu · 5–8 PM.</h2>
            </div>
            <p className="sub muted">
              Room 214, Mr. Kissee. Community games count toward silver
              trophies. Pro sessions count toward gold. Leaderboards reset on
              the 1st.
            </p>
          </div>

          <Reveal as="div" className="bento" stagger>
            <Spotlight className="b-card b-span-4">
              <div className="b-head">
                <div>
                  <Eyebrow>League week</Eyebrow>
                  <div className="b-title" style={{ marginTop: 6 }}>
                    Four nights, four modes
                  </div>
                </div>
                <span className="icon-chip" data-accent="yellow">
                  <CalendarClock size={18} />
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 10,
                  marginTop: 20,
                }}
              >
                {DAYS.map((day) => (
                  <div
                    key={day}
                    style={{
                      background: "var(--surface-2)",
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                      padding: "12px 10px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--text-3)",
                      }}
                    >
                      {day}
                    </div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 14,
                        marginTop: 4,
                      }}
                    >
                      5 – 8 PM
                    </div>
                  </div>
                ))}
              </div>
            </Spotlight>

            <Spotlight className="b-card b-span-2">
              <span className="icon-chip" data-accent="green">
                <Sparkles size={18} />
              </span>
              <div className="b-title" style={{ marginTop: 16 }}>
                Wednesday ritual
              </div>
              <div className="b-desc">
                Recap, goals, minutes — then shuffle and play.
              </div>
              <Link
                href="/minutes"
                className="btn btn-ghost btn-sm"
                style={{ marginTop: 16, alignSelf: "flex-start" }}
              >
                Read the minutes
              </Link>
            </Spotlight>
          </Reveal>
        </div>
      </Section>

      <Section accent="red">
        <div className="container-page">
          <div className="section-head">
            <div>
              <Eyebrow>Officers</Eyebrow>
              <h2 className="heading-2">Who runs it.</h2>
            </div>
            <p className="sub muted">
              Elected students plus a teacher rep. Decisions happen in the open,
              at the Wednesday meeting.
            </p>
          </div>

          <Reveal as="div" className="off-grid" stagger>
            {OFFICERS.map((officer) => {
              const init = officer.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("");
              return (
                <div key={officer.name} className="off">
                  <span
                    className="off-ava"
                    style={{
                      background: `color-mix(in srgb, var(--uno-${officer.accent}) 22%, var(--surface-2))`,
                      borderColor: `color-mix(in srgb, var(--uno-${officer.accent}) 45%, var(--border))`,
                    }}
                    aria-hidden
                  >
                    {init}
                  </span>
                  <div className="off-role">{ROLE_LABEL[officer.role]}</div>
                  <div className="off-name">{officer.name}</div>
                  <div className="off-note">{officer.title}</div>
                </div>
              );
            })}
          </Reveal>
        </div>
      </Section>

      <Section>
        <div className="container-page">
          <Reveal
            as="div"
            style={{
              position: "relative",
              border: "1px solid var(--border)",
              borderRadius: 20,
              padding: "clamp(40px, 6vw, 80px)",
              textAlign: "center",
              overflow: "hidden",
              background: "var(--surface)",
            }}
          >
            <div className="grid-bg" />
            <div className="aurora" style={{ opacity: 0.5 }} />
            <div style={{ position: "relative" }}>
              <Eyebrow>Season is open</Eyebrow>
              <h2
                className="heading-2"
                style={{ maxWidth: 720, margin: "14px auto 0" }}
              >
                Come play Wednesday. Stay for the bracket.
              </h2>
              <p
                className="muted"
                style={{
                  maxWidth: 440,
                  margin: "18px auto 0",
                  fontSize: 15,
                }}
              >
                Open to anyone at Ripon. No experience required. We&apos;ll
                teach you stacking, you&apos;ll teach us your custom wild.
              </p>
              <div
                style={{
                  display: "inline-flex",
                  gap: 10,
                  marginTop: 28,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <Show when="signed-out">
                  <SignUpTrigger type="button" className="btn btn-primary">
                    Create account
                  </SignUpTrigger>
                </Show>
                <Show when="signed-in">
                  <Link href="/chat" className="btn btn-primary">
                    Open chat
                  </Link>
                </Show>
                <Link href="/fundraisers" className="btn btn-ghost">
                  How it works
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
