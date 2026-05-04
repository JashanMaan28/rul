import Link from "next/link";
import { RulMark } from "~/components/brand/rul-mark";
import { CurrentYear } from "~/components/site/current-year";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container-page">
        <div className="footer-grid">
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 18,
              }}
            >
              <RulMark large />
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Ripon Uno League
                </div>
                <div
                  className="mono faint"
                  style={{ fontSize: 11, marginTop: 2 }}
                >
                  Est. 2026 · Room G3
                </div>
              </div>
            </div>
            <p
              className="muted"
              style={{ fontSize: 13.5, maxWidth: 280, lineHeight: 1.55 }}
            >
              Ripon High School&apos;s official UNO club. Run by students,
              sanctioned by the school.
            </p>
          </div>

          <div>
            <h5>League</h5>
            <ul>
              <li>
                <Link href="/leaderboard">Leaderboard</Link>
              </li>
              <li>
                <Link href="/polls">Vote</Link>
              </li>
              <li>
                <Link href="/archive">Archive</Link>
              </li>
              <li>
                <Link href="/officers">Officers</Link>
              </li>
            </ul>
          </div>

          <div>
            <h5>Community</h5>
            <ul>
              <li>
                <Link href="/minutes">Minutes</Link>
              </li>
              <li>
                <Link href="/fundraisers">Fundraisers</Link>
              </li>
            </ul>
          </div>

          <div>
            <h5>Contact</h5>
            <ul>
              <li>
                <span>Room G3 · Mr. Kissee</span>
              </li>
              <li>
                <span>Mon-Thu · 12:17-12:56 PM</span>
              </li>
              <li>
                <span>Wednesday · 11:51-12:31 PM</span>
              </li>
              <li>
                <span>62805288@riponusd.net</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© <CurrentYear /> RIPON UNO LEAGUE</span>
          <Link href="/constitution">CONSTITUTION · RIPON, CA</Link>
        </div>
      </div>
    </footer>
  );
}
