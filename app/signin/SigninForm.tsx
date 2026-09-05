"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type AuthMethod = "password" | "otp";
type AccountType = "client" | "workforce";
type StoredProfile = {
  accountType?: AccountType;
  fullName?: string;
  email?: string;
  phone?: string;
  projectName?: string;
};

const normalizePhone = (value: string) => value.replace(/\D/g, "");

export default function SigninForm({ initialEmail, created, createdType }: {
  initialEmail: string;
  created: boolean;
  createdType: AccountType;
}) {
  const router = useRouter();
  const [method, setMethod] = useState<AuthMethod>("password");
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");

  const readProfiles = () => {
    const keys = ["vss_client_profile", "vss_workforce_profile", "vss_profile"];
    return keys.flatMap((key) => {
      try {
        const value = localStorage.getItem(key);
        return value ? [JSON.parse(value) as StoredProfile] : [];
      } catch {
        return [];
      }
    });
  };

  const completeSignIn = (profile: StoredProfile, authMethod: AuthMethod) => {
    const accountType = profile.accountType ?? "client";
    localStorage.setItem("vss_profile", JSON.stringify({ ...profile, accountType }));
    localStorage.setItem("vss_session", JSON.stringify({
      email: profile.email ?? email,
      phone: profile.phone ?? phone,
      name: profile.fullName ?? "Workspace member",
      accountType,
      authMethod,
    }));
    router.push("/workspace");
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const profiles = readProfiles();

    if (method === "password") {
      if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
        setError("Enter your email and a password with at least 8 characters.");
        return;
      }
      const profile = profiles.find((item) => item.email?.toLowerCase() === email.toLowerCase());
      if (!profile) {
        setError("No account was found for this email. Create a client or workforce account first.");
        return;
      }
      completeSignIn(profile, "password");
      return;
    }

    if (normalizePhone(phone).length < 10) {
      setError("Enter the mobile number used during registration, including country code.");
      return;
    }
    const profile = profiles.find((item) => normalizePhone(item.phone ?? "") === normalizePhone(phone));
    if (!profile) {
      setError("No account was found for this mobile number. Create an account first.");
      return;
    }
    if (!otpSent) {
      setOtpSent(true);
      return;
    }
    if (otp !== "246810") {
      setError("Enter the 6-digit demo OTP shown below.");
      return;
    }
    completeSignIn(profile, "otp");
  };

  const switchMethod = (nextMethod: AuthMethod) => {
    setMethod(nextMethod);
    setError("");
    setOtpSent(false);
    setOtp("");
  };

  return (
    <main className="authPage authPageSignin">
      <section className="authStory" aria-label="Vaniyathans workspace">
        <Link className="authLogo" href="/" aria-label="Vaniyathans home">
          <Image src="/vaniyathans-logo-2026.png" alt="Vaniyathans Software Solutions" width={1984} height={793} preload />
        </Link>
        <div className="authStoryCopy">
          <p className="authEyebrow"><span /> ONE SIGN-IN · TWO ACCOUNT TYPES</p>
          <h1>Your product.<br /><em>Always in motion.</em></h1>
          <p>Clients and workforce members enter the same studio with an experience matched to their account role.</p>
        </div>
        <div className="signinSignal" aria-hidden="true">
          <div><span>CLIENT</span><i /></div><div><span>SECURE ACCESS</span><i /></div><div><span>WORKFORCE</span></div>
        </div>
      </section>

      <section className="authPanel" aria-labelledby="signin-title">
        <div className="authPanelTop"><Link href="/">← Back to website</Link><span>Need an account? <Link href="/signup">Choose account type</Link></span></div>
        <form className="authForm signinForm" onSubmit={submit} noValidate>
          {created && <div className="authSuccess"><span>✓</span><div><strong>{createdType === "client" ? "Client" : "Workforce"} account created</strong><p>Sign in to open your Workspace Studio.</p></div></div>}
          <div className="authHeading">
            <span>SECURE ACCOUNT ACCESS</span>
            <h2 id="signin-title">Welcome back</h2>
            <p>Use your email and password or sign in with a one-time mobile code.</p>
          </div>

          <div className="authMethodTabs" role="tablist" aria-label="Sign-in method">
            <button className={method === "password" ? "isActive" : ""} type="button" role="tab" aria-selected={method === "password"} onClick={() => switchMethod("password")}><span>✉</span>Email &amp; password</button>
            <button className={method === "otp" ? "isActive" : ""} type="button" role="tab" aria-selected={method === "otp"} onClick={() => switchMethod("otp")}><span>⌁</span>Mobile OTP</button>
          </div>

          {method === "password" ? (
            <div className="authFields signinFields">
              <label className="fieldWide"><span>Email address</span><input autoFocus type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(""); }} placeholder="you@example.com" autoComplete="email" /></label>
              <label className="fieldWide"><span>Password</span><input type="password" value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} placeholder="Minimum 8 characters" autoComplete="current-password" /></label>
            </div>
          ) : (
            <div className="authFields signinFields">
              <label className="fieldWide"><span>Registered mobile number</span><input autoFocus type="tel" value={phone} disabled={otpSent} onChange={(event) => { setPhone(event.target.value); setError(""); }} placeholder="+91 98765 43210" autoComplete="tel" /></label>
              {otpSent && <label className="fieldWide"><span>6-digit OTP</span><input className="otpInput" value={otp} onChange={(event) => { setOtp(event.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }} placeholder="••••••" inputMode="numeric" autoComplete="one-time-code" /></label>}
              {otpSent && <div className="otpStatus fieldWide"><span>OTP ready for this prototype</span><strong>Demo code: 246810</strong><button type="button" onClick={() => { setOtpSent(false); setOtp(""); setError(""); }}>Change number</button></div>}
            </div>
          )}

          {method === "password" && <div className="signinOptions"><label><input type="checkbox" defaultChecked /> Keep me signed in</label><button type="button">Forgot password?</button></div>}
          {error && <p className="authError" role="alert">{error}</p>}
          <button className="authPrimary authPrimaryWide" type="submit">{method === "otp" && !otpSent ? "Send mobile OTP" : "Open Workspace Studio"} <span>→</span></button>

          <div className="signupRoutes">
            <span>New to Vaniyathans?</span>
            <Link href="/signup/client"><i>◎</i><span><strong>Client signup</strong><small>Start a project</small></span>→</Link>
            <Link href="/signup/workforce"><i>⌘</i><span><strong>Workforce signup</strong><small>Join delivery</small></span>→</Link>
          </div>
          <p className="authSupport">Account support: <a href="mailto:support@vaniyathans.com">support@vaniyathans.com</a></p>
          <p className="authDemoNote">This hosted experience demonstrates the complete account flow. A production identity and messaging provider is still required before real passwords or OTPs can be issued.</p>
        </form>
      </section>
    </main>
  );
}
