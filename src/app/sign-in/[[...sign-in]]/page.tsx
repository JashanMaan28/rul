import { SignIn } from "@clerk/nextjs";
import { Aurora, Eyebrow, GridBG } from "~/components/primitives";

export default function SignInPage() {
  return (
    <section className="auth-shell">
      <Aurora />
      <GridBG />
      <div className="auth-inner">
        <div style={{ display: "grid", gap: 10, justifyItems: "center" }}>
          <Eyebrow>Welcome back</Eyebrow>
          <h1 className="auth-title">Sign in to RUL.</h1>
          <p className="auth-desc">
            Officers get the dashboard, members get the roster, and everyone
            gets a seat at the table.
          </p>
        </div>
        <SignIn />
      </div>
    </section>
  );
}
