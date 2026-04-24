import { SignUp } from "@clerk/nextjs";
import { Aurora, Eyebrow, GridBG } from "~/components/primitives";

export default function SignUpPage() {
  return (
    <section className="auth-shell">
      <Aurora />
      <GridBG />
      <div className="auth-inner">
        <div style={{ display: "grid", gap: 10, justifyItems: "center" }}>
          <Eyebrow>Pull up a chair</Eyebrow>
          <h1 className="auth-title">Join the league.</h1>
          <p className="auth-desc">
            Sign up with your school email to get on the roster, track trophies,
            and jump into club chat.
          </p>
        </div>
        <SignUp />
      </div>
    </section>
  );
}
