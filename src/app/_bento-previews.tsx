"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

const META_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--text-3)",
};

type MinuteItem = { label: string; done: boolean };

const INITIAL_MINUTE_ITEMS: MinuteItem[] = [
  { label: "Attendance · 18 of 22", done: true },
  { label: "Nationals travel budget", done: true },
  { label: "Custom wild cards vote", done: false },
  { label: "Seven-O Swap bracket", done: false },
];

export function MinutesPreview() {
  const [items, setItems] = useState(INITIAL_MINUTE_ITEMS);
  const id = useId();
  const done = items.filter((i) => i.done).length;

  const toggle = (idx: number) => {
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, done: !it.done } : it)),
    );
  };

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
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {done} / {items.length}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {items.map((it, idx) => (
          <label
            key={it.label}
            htmlFor={`${id}-${idx}`}
            style={{
              display: "flex",
              gap: 11,
              alignItems: "center",
              fontSize: 13,
              color: it.done ? "var(--text-3)" : "var(--text)",
              cursor: "pointer",
              padding: "5px 6px",
              margin: "0 -6px",
              borderRadius: 6,
              transition: "background 0.15s ease, color 0.15s ease",
              userSelect: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--surface)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <input
              id={`${id}-${idx}`}
              type="checkbox"
              checked={it.done}
              onChange={() => toggle(idx)}
              className="bento-checkbox"
            />
            <span
              aria-hidden
              className="bento-checkbox__visual"
              data-checked={it.done}
            >
              {it.done && (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.5 5L4 7.5L8.5 2.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <span
              style={{
                textDecorationLine: it.done ? "line-through" : "none",
                textDecorationColor: "color-mix(in srgb, var(--text-3) 60%, transparent)",
                transition: "text-decoration-color 0.2s ease",
              }}
            >
              {it.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

type PollOption = {
  key: string;
  label: string;
  votes: number;
  color: "red" | "yellow" | "green" | "blue";
};

const INITIAL_POLL: PollOption[] = [
  { key: "wild", label: "Custom wild rules", votes: 14, color: "red" },
  { key: "seven", label: "Seven-O Swap bracket", votes: 8, color: "yellow" },
];

export function PollPreview() {
  const [options, setOptions] = useState(INITIAL_POLL);
  const [voted, setVoted] = useState<string | null>(null);
  const total = options.reduce((s, o) => s + o.votes, 0);

  const cast = (key: string) => {
    if (voted) return;
    setVoted(key);
    setOptions((prev) =>
      prev.map((o) => (o.key === key ? { ...o, votes: o.votes + 1 } : o)),
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: "10px 12px",
        borderRadius: 10,
        border: "1px solid var(--border)",
        background: "var(--surface-2)",
      }}
    >
      {options.map((opt) => {
        const pct = total === 0 ? 0 : Math.round((opt.votes / total) * 100);
        const isVoted = voted === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => cast(opt.key)}
            disabled={voted !== null}
            aria-pressed={isVoted}
            style={{
              all: "unset",
              display: "flex",
              flexDirection: "column",
              gap: 3,
              cursor: voted ? "default" : "pointer",
              padding: "4px 6px",
              margin: "0 -6px",
              borderRadius: 6,
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (!voted) e.currentTarget.style.background = "var(--surface)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11,
                color: "var(--text-2)",
                lineHeight: 1.2,
                gap: 8,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {isVoted && (
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M1.5 5L4 7.5L8.5 2.5"
                      stroke={`var(--uno-${opt.color})`}
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                {opt.label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  color: isVoted ? `var(--uno-${opt.color})` : "var(--text)",
                  fontSize: 10.5,
                  fontVariantNumeric: "tabular-nums",
                  transition: "color 0.2s ease",
                }}
              >
                {pct}%
              </span>
            </div>
            <div
              style={{
                height: 5,
                borderRadius: 999,
                background: "var(--surface)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  background: `var(--uno-${opt.color})`,
                  borderRadius: 999,
                  transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </div>
          </button>
        );
      })}
      <div
        style={{
          ...META_STYLE,
          fontSize: 9,
          marginTop: 2,
        }}
      >
        {voted ? "Vote recorded · " : "Tap to vote · "}
        {total} {total === 1 ? "vote" : "votes"}
      </div>
    </div>
  );
}

type Signer = { initials: string; color: "red" | "yellow" | "green" | "blue" };

const INITIAL_SIGNERS: Signer[] = [
  { initials: "JM", color: "red" },
  { initials: "AK", color: "yellow" },
  { initials: "RT", color: "green" },
  { initials: "DP", color: "blue" },
  { initials: "EL", color: "red" },
  { initials: "SV", color: "yellow" },
];

const NEW_SIGNERS: Signer[] = [
  { initials: "TK", color: "green" },
  { initials: "MR", color: "blue" },
  { initials: "BH", color: "red" },
  { initials: "PN", color: "yellow" },
];

export function FundraiserPreview() {
  const goal = 1200;
  const [raised, setRaised] = useState(612);
  const [signers, setSigners] = useState(INITIAL_SIGNERS);
  const [animatedRaised, setAnimatedRaised] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const seenRef = useRef(false);

  const pct = Math.round((raised / goal) * 100);
  const animatedPct = Math.round((animatedRaised / goal) * 100);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !seenRef.current) {
          seenRef.current = true;
          const start = performance.now();
          const duration = 900;
          const startVal = 0;
          const endVal = raised;
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setAnimatedRaised(Math.round(startVal + (endVal - startVal) * eased));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [raised]);

  const sign = () => {
    if (signers.length >= INITIAL_SIGNERS.length + NEW_SIGNERS.length) return;
    const next = NEW_SIGNERS[signers.length - INITIAL_SIGNERS.length];
    if (!next) return;
    setSigners((prev) => [...prev, next]);
    setRaised((r) => Math.min(goal, r + 25));
    setAnimatedRaised((r) => Math.min(goal, r + 25));
  };

  const allSigned = signers.length >= INITIAL_SIGNERS.length + NEW_SIGNERS.length;

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
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
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={META_STYLE}>Nationals fund</div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 22,
              fontWeight: 600,
              color: "var(--text)",
              marginTop: 4,
              letterSpacing: "-0.02em",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            ${animatedRaised}
            <span style={{ color: "var(--text-3)", fontSize: 14 }}>
              {" "}
              / ${goal}
            </span>
          </div>
        </div>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--uno-red)",
            border: "1px solid color-mix(in srgb, var(--uno-red) 40%, var(--border))",
            background: "color-mix(in srgb, var(--uno-red) 14%, var(--surface-2))",
            padding: "3px 8px",
            borderRadius: 999,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {animatedPct}%
        </span>
      </div>
      <div
        style={{
          height: 8,
          borderRadius: 999,
          background: "var(--surface)",
          overflow: "hidden",
          border: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            width: `${animatedPct}%`,
            height: "100%",
            background:
              "linear-gradient(90deg, var(--uno-red) 0%, var(--uno-yellow) 100%)",
            borderRadius: 999,
            transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>
      <div>
        <div
          style={{
            ...META_STYLE,
            marginBottom: 8,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Recent signers · {signers.length}</span>
          <button
            type="button"
            onClick={sign}
            disabled={allSigned}
            style={{
              all: "unset",
              cursor: allSigned ? "default" : "pointer",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: allSigned ? "var(--text-3)" : "var(--text-2)",
              padding: "3px 8px",
              borderRadius: 999,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              transition: "background 0.15s ease, color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (allSigned) return;
              e.currentTarget.style.background = "var(--surface-2)";
              e.currentTarget.style.color = "var(--text)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--surface)";
              e.currentTarget.style.color = allSigned
                ? "var(--text-3)"
                : "var(--text-2)";
            }}
          >
            {allSigned ? "Wall full" : "+ Sign"}
          </button>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {signers.map((s, i) => (
            <span
              key={`${s.initials}-${i}`}
              style={{
                width: 36,
                height: 50,
                borderRadius: 8,
                background: `var(--uno-${s.color})`,
                color: "var(--uno-ink)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                fontWeight: 700,
                border: "1px solid color-mix(in srgb, #000 25%, transparent)",
                boxShadow: "0 1px 0 rgba(255,255,255,0.15) inset",
                animation:
                  i >= INITIAL_SIGNERS.length ? "bento-pop 0.4s ease-out" : undefined,
              }}
            >
              {s.initials}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

type Member = {
  initials: string;
  name: string;
  role: string;
  color: "red" | "yellow" | "green" | "blue";
};

const MEMBERS: Member[] = [
  { initials: "JM", name: "Jashan M.", role: "Honorary Founder", color: "red" },
  { initials: "AK", name: "Aaron K.", role: "President", color: "yellow" },
  { initials: "RT", name: "Riley T.", role: "VP", color: "green" },
  { initials: "DP", name: "Dev P.", role: "Secretary", color: "blue" },
  { initials: "EL", name: "Ethan L.", role: "Member rep", color: "red" },
];

export function MembersPreview() {
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered !== null ? MEMBERS[hovered] : null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid var(--border)",
        background: "var(--surface-2)",
        position: "relative",
        minHeight: 50,
      }}
    >
      <div style={{ display: "flex" }}>
        {MEMBERS.map((m, i) => (
          <button
            key={m.initials}
            type="button"
            aria-label={`${m.name}, ${m.role}`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(i)}
            onBlur={() => setHovered(null)}
            style={{
              all: "unset",
              cursor: "pointer",
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: `color-mix(in srgb, var(--uno-${m.color}) 28%, var(--surface))`,
              border: "2px solid var(--surface-2)",
              color: "var(--text)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fontWeight: 600,
              marginLeft: i === 0 ? 0 : -10,
              transform: hovered === i ? "translateY(-3px) scale(1.1)" : "none",
              zIndex: hovered === i ? 5 : MEMBERS.length - i,
              transition: "transform 0.18s ease",
              boxSizing: "border-box",
            }}
          >
            {m.initials}
          </button>
        ))}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.05em",
          color: active ? "var(--text)" : "var(--text-3)",
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          transition: "color 0.15s ease",
        }}
      >
        {active ? (
          <>
            <span>{active.name}</span>
            <span style={{ color: "var(--text-3)" }}> · {active.role}</span>
          </>
        ) : (
          "+ 35 more"
        )}
      </div>
    </div>
  );
}

const ARTICLE_REFS = [
  { numeral: "I", title: "Name & purpose", anchor: "article-i" },
  { numeral: "II", title: "Membership", anchor: "article-ii" },
  { numeral: "III", title: "Officers", anchor: "article-iii" },
  { numeral: "IV", title: "Meetings", anchor: "article-iv" },
] as const;

export function ConstitutionPreview() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: "8px 8px",
        borderRadius: 12,
        border: "1px solid var(--border)",
        background: "var(--surface-2)",
      }}
    >
      {ARTICLE_REFS.map((a) => (
        <Link
          key={a.numeral}
          href={`/constitution#${a.anchor}`}
          className="bento-article-row"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 12,
            color: "var(--text-2)",
            padding: "4px 6px",
            borderRadius: 6,
            textDecoration: "none",
            transition: "background 0.15s ease, color 0.15s ease",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.08em",
              color: "var(--uno-yellow)",
              minWidth: 28,
            }}
          >
            ART {a.numeral}
          </span>
          <span style={{ flex: 1 }}>{a.title}</span>
          <span
            aria-hidden
            className="bento-article-row__chevron"
            style={{
              color: "var(--text-3)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              transition: "transform 0.15s ease, color 0.15s ease",
            }}
          >
            →
          </span>
        </Link>
      ))}
    </div>
  );
}
