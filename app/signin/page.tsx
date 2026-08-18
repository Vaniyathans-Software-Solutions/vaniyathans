"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function SigninForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const created = searchParams.get("created") === "1";

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
      setError("Enter your work email and a password with at least 8 characters.");
      return;
    }

    const savedProfile = localStorage.getItem("vss_profile");
    if (savedProfile) {
      const profile = JSON.parse(savedProfile) as { email?: string; fullName?: string };
      if (profile.email && profile.email.toLowerCase() !== email.toLowerCase()) {
        setError(`This demo workspace is registered to ${profile.email}.`);
        return;
      }
      localStorage.setItem("vss_session", JSON.stringify({ email, name: profile.fullName ?? "Workspace member" }));
    } else {
      localStorage.setItem("vss_session", JSON.stringify({ email, name: "Workspace member" }));
    }
    router.push("/workspace");
  };

  return (
    <main className="authPage authPageSignin">
      <section className="authStory" aria-label="Vaniyathans workspace">
        <Link className="authLogo" href="/">VANIYATHANS</Link>
        <div className="authStoryCopy">
          <p className="authEyebrow"><span /> WORKSPACE STUDIO</p>
          <h1>Your product.<br /><em>Always in motion.</em></h1>
          <p>Enter the studio to see every epic, feature, story, task, and release moving across your 24/7 workforce.</p>
        </div>
        <div className="signinSignal" aria-hidden="true">
          <div><span>EPIC</span><i /></div><div><span>FEATURE</span><i /></div><div><span>STORY</span><i /></div><div><span>DEPLOY</span></div>
        </div>
      </section>

      <section className="authPanel" aria-labelledby="signin-title">
        <div className="authPanelTop"><Link href="/">← Back to website</Link><span>New here? <Link href="/signup">Create an account</Link></span></div>
        <form className="authForm signinForm" onSubmit={submit} noValidate>
          {created && <div className="authSuccess"><span>✓</span><div><strong>Workspace created</strong><p>Sign in to open your new project studio.</p></div></div>}
          <div className="authHeading">
            <span>SECURE WORKSPACE ACCESS</span>
            <h2 id="signin-title">Welcome back</h2>
            <p>Sign in to continue building without delay.</p>
          </div>
          <div className="authFields">
            <label className="fieldWide"><span>Work email</span><input autoFocus type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(""); }} placeholder="you@company.com" autoComplete="email" /></label>
            <label className="fieldWide"><span>Password</span><input type="password" value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} placeholder="Minimum 8 characters" autoComplete="current-password" /></label>
          </div>
          <div className="signinOptions"><label><input type="checkbox" defaultChecked /> Keep me signed in</label><button type="button">Forgot password?</button></div>
          {error && <p className="authError" role="alert">{error}</p>}
          <button className="authPrimary authPrimaryWide" type="submit">Open Workspace Studio <span>→</span></button>
          <p className="authDemoNote">Prototype access: use the email from signup and any 8+ character password. Production authentication will be connected before launch.</p>
        </form>
      </section>
    </main>
  );
}

export default function SigninPage() {
  return <Suspense fallback={<main className="authLoading">Opening secure access…</main>}><SigninForm /></Suspense>;
}
