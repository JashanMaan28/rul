import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Eyebrow, Reveal, Section } from "~/components/primitives";

export const metadata: Metadata = {
  title: "Constitution",
  description:
    "The official constitution of Ripon Uno League — structure, elections, meetings, and governance.",
};

type ArticleSection = {
  label: string;
  body: ReactNode;
};

type Article = {
  numeral: string;
  title: string;
  sections: ArticleSection[];
};

const ARTICLES: Article[] = [
  {
    numeral: "I",
    title: "Name and Identification",
    sections: [
      {
        label: "A",
        body: (
          <>
            The name of this organization shall be the Ripon Uno League,
            hereafter referred to as RUL.
          </>
        ),
      },
      {
        label: "B",
        body: (
          <>
            The purpose of RUL is to create a fun, welcoming, and inclusive
            community for students who enjoy playing Uno. The club will meet
            daily at lunch in Mr. Kissee&apos;s room to facilitate both casual
            play and organized competitive Uno tournaments. RUL aims to bring
            students together, build friendships, and provide an enjoyable
            environment where all students feel welcome.
          </>
        ),
      },
      {
        label: "C",
        body: (
          <>
            Information about meetings, tournaments, and events will be
            announced across school-wide announcements, via social media, and
            through a club Google Classroom. All club members are encouraged to
            attend daily lunch meetings.
          </>
        ),
      },
    ],
  },
  {
    numeral: "II",
    title: "Membership",
    sections: [
      {
        label: "A",
        body: (
          <>
            Membership is open to all Ripon High School students with an
            interest in Uno or community-building.
          </>
        ),
      },
      {
        label: "B",
        body: (
          <>
            There are no racial, ethnic, gender, GPA, or skill-level
            requirements to join. All students are welcome regardless of prior
            Uno experience.
          </>
        ),
      },
      {
        label: "C",
        body: <>Members shall be entitled to one vote in all club decisions.</>,
      },
    ],
  },
  {
    numeral: "III",
    title: "Officers and Elections",
    sections: [
      {
        label: "A",
        body: (
          <>
            <p>
              Officer positions shall include: President/Co-Presidents, Vice
              President, Treasurer, Secretary, and Publicity Officer.
            </p>
            <ul className="officer-list">
              <li>
                <strong>President / Co-Presidents.</strong> Represent the club
                at all school-wide functions, run daily meetings, plan
                tournament schedules, and make final club decisions. They
                delegate responsibilities to officers when preparing for events.
              </li>
              <li>
                <strong>Vice President.</strong> Assists the President or
                Co-Presidents, communicates with officers and members when the
                President is unavailable, tracks attendance, and addresses any
                concerns from club members or staff.
              </li>
              <li>
                <strong>Treasurer.</strong> Responsible for all financial
                paperwork including purchase orders and cash box forms. Keeps
                monthly records of the club&apos;s budget and reports to the
                President or Co-Presidents when needed.
              </li>
              <li>
                <strong>Secretary.</strong> Takes club meeting minutes,
                maintains records of all meetings throughout the year, and
                shares minutes with all officers and the Advisor. Keeps an
                organized binder of minutes, purchase orders, and club
                communications.
              </li>
              <li>
                <strong>Publicity Officer.</strong> Maintains the club&apos;s
                presence across all school-approved platforms. Makes
                announcements about meetings, tournaments, and events, and
                promotes RUL activities through social media, flyers, and
                school announcements.
              </li>
            </ul>
          </>
        ),
      },
      {
        label: "B",
        body: (
          <>
            Officer selection will occur at the end of the current school year
            for the following school year.
          </>
        ),
      },
      {
        label: "C",
        body: (
          <>
            RUL Officers will be chosen after a thorough review of an officer
            application by the current President or Co-Presidents and Club
            Advisor.
          </>
        ),
      },
      {
        label: "D",
        body: (
          <>
            All Officers will serve for one full school year and must reapply to
            serve the following year. If concerns are raised, officers may be
            removed from their positions. A formal meeting with all Officers and
            the Club Advisor must be held to remove an officer, and a majority
            vote will be taken. Removal of an officer must require a just reason
            supported by accounts of multiple people.
          </>
        ),
      },
      {
        label: "E",
        body: (
          <>
            All applicants for officer positions must have been club members for
            at least one semester.
          </>
        ),
      },
    ],
  },
  {
    numeral: "IV",
    title: "Adult Advisors",
    sections: [
      {
        label: "A",
        body: (
          <>
            Adult Advisors are appointed by the Superintendent, Principal,
            Faculty, Student Council, or ASB Activities Director.
          </>
        ),
      },
      {
        label: "B",
        body: (
          <>
            At least one faculty advisor shall be approved by the Principal or
            the Ripon High Activities Director as the designated representative
            for RUL&apos;s activities. The designated faculty advisor for RUL
            is Mr. Kissee, in whose room daily meetings shall be held.
          </>
        ),
      },
      {
        label: "C",
        body: (
          <>
            All powers granted in the Constitution are derived from the
            Principal as prescribed in the California State Education Code and
            exercised with their consent or approval. They may at any time
            declare this constitution wholly or in part suspended or null and
            void. They can remove any officer from office at any time for any
            just cause.
          </>
        ),
      },
    ],
  },
  {
    numeral: "V",
    title: "Meetings and Activities",
    sections: [
      {
        label: "A",
        body: (
          <>
            RUL shall meet every school day at lunch in Mr. Kissee&apos;s room,
            unless otherwise announced by the officers or Advisor.
          </>
        ),
      },
      {
        label: "B",
        body: (
          <>
            Daily meetings will primarily consist of casual Uno play open to all
            members. Members may join or leave casual play freely during the
            lunch period.
          </>
        ),
      },
      {
        label: "C",
        body: (
          <>
            Competitive Uno tournaments will be organized and run by the
            officers in coordination with the President or Co-Presidents.
            Tournaments may follow formats including but not limited to: single
            elimination, double elimination, and round-robin. Tournament rules
            and formats will be announced in advance of each event.
          </>
        ),
      },
      {
        label: "D",
        body: (
          <>
            Special meetings or events may be called by the President or
            Co-Presidents, or at the request of at least one-third of the
            club&apos;s membership, with Advisor approval.
          </>
        ),
      },
    ],
  },
  {
    numeral: "VI",
    title: "Financial Activities",
    sections: [
      {
        label: "A",
        body: (
          <>
            RUL&apos;s funds will be used to benefit the student body and the
            club itself in accordance with the California Education Code and
            the Board of Education regulations. Funds may be used for Uno card
            supplies, tournament prizes, and other club-approved materials.
          </>
        ),
      },
      {
        label: "B",
        body: (
          <>
            All requests for expenditures require a signature from the Treasurer
            and Advisor.
          </>
        ),
      },
      {
        label: "C",
        body: (
          <>
            All expenditures must be approved by the officers and signed by the
            Treasurer, President or Co-Presidents, and ASB Bookkeeper.
          </>
        ),
      },
      {
        label: "D",
        body: (
          <>
            An annual balanced budget will be prepared by the Treasurer before
            the end of the year to direct the financial programs for ASB that
            year.
          </>
        ),
      },
    ],
  },
  {
    numeral: "VII",
    title: "Constitution and Amendments",
    sections: [
      {
        label: "A",
        body: (
          <>
            Any amendments to the constitution must be discussed formally with
            the Officers and the Club Advisor.
          </>
        ),
      },
      {
        label: "B",
        body: (
          <>
            Amendments may be proposed by any club member and will be discussed
            at a regular meeting. To pass, an amendment must receive a
            two-thirds (2/3) majority vote from the members present. All
            amendments must remain consistent with school policies.
          </>
        ),
      },
      {
        label: "C",
        body: (
          <>
            All accepted amendments must be posted in a conspicuous place for at
            least five school days prior to the amendment vote.
          </>
        ),
      },
    ],
  },
  {
    numeral: "VIII",
    title: "Approval",
    sections: [
      {
        label: "A",
        body: (
          <>
            This constitution shall be in effect upon ratification by a majority
            of the founding officers and upon receiving official recognition
            from school administration.
          </>
        ),
      },
    ],
  },
];

const SIGNATORIES = [
  "Principal",
  "ASB Director",
  "Club Advisor (Mr. Kissee)",
  "President / Co-Presidents",
  "Vice President",
  "Treasurer",
  "Secretary",
  "Publicity Officer",
];

export default function ConstitutionPage() {
  return (
    <Section accent="red">
      <div className="container-page" style={{ maxWidth: 820 }}>
        <div className="page-head">
          <div>
            <Eyebrow>Governing document</Eyebrow>
            <h1>Constitution.</h1>
            <p className="sub" style={{ marginTop: 10 }}>
              How Ripon Uno League is structured, governed, and held
              accountable. Ratified by the founding officers and the school
              administration.
            </p>
          </div>
        </div>

        <Reveal as="div" className="constitution">
          <blockquote className="preamble">
            As proud members of Ripon High School, it is our objective to
            empower and encourage students to create a positive impact on the
            world around us by building community, fostering friendship, and
            providing a welcoming space for students of all backgrounds.
          </blockquote>

          {ARTICLES.map((article) => (
            <article key={article.numeral} className="const-article">
              <header className="const-article-head">
                <span className="mono faint const-numeral">
                  Article {article.numeral}
                </span>
                <h2>{article.title}</h2>
              </header>
              <div className="const-sections">
                {article.sections.map((section) => (
                  <div key={section.label} className="const-section">
                    <span className="const-section-label">{section.label}</span>
                    <div className="const-section-body">{section.body}</div>
                  </div>
                ))}
              </div>
            </article>
          ))}

          <section className="const-signatures">
            <h3>Signatures</h3>
            <p className="muted" style={{ fontSize: 13.5, marginTop: 6 }}>
              Ratified upon signature by the following parties.
            </p>
            <ul>
              {SIGNATORIES.map((role) => (
                <li key={role}>
                  <span className="sig-line" aria-hidden />
                  <span className="sig-role">{role}</span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      </div>
    </Section>
  );
}
