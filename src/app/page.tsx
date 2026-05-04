import Link from "next/link";
import {
  CalendarClock,
  ClipboardList,
  Gift,
  ScrollText,
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
import {
  ConstitutionPreview,
  FundraiserPreview,
  MembersPreview,
  MinutesPreview,
  PollPreview,
} from "./_bento-previews";

const DAYS = ["Mon", "Tue", "Wed", "Thu"] as const;

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
            glowColor="239, 68, 68"
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
                  "Live polls for custom rules, event picks, and gamemode rotations.",
                preview: <PollPreview />,
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
                preview: <FundraiserPreview />,
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
                preview: <MembersPreview />,
              },
              {
                label: "Open governance",
                accent: "yellow",
                icon: <ScrollText size={18} />,
                title: "Constitution",
                description:
                  "Bylaws ratified by members. Elections, meetings, and amendments — in writing.",
                preview: <ConstitutionPreview />,
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
