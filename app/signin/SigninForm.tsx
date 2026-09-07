"use client";

import { useLocale } from "@/app/i18n/LocaleProvider";

import LanguageSwitcher from "@/app/i18n/LanguageSwitcher";
import Link from "@/app/i18n/LocalizedLink";
import BrandLogo from "@/app/BrandLogo";
import { useLocalizedRouter as useRouter } from "@/app/i18n/LocaleProvider";
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
  const { t, locale } = useLocale();
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
      <section className="authStory" aria-label={t("Vaniyathans workspace")}>
        <Link className="authLogo" href="/" aria-label={t("Vaniyathans home")}>
          <BrandLogo locale={locale} preload />
        </Link>
        <div className="authStoryCopy">
          <p className="authEyebrow"><span /> {t("ONE SIGN-IN · TWO ACCOUNT TYPES")}</p>
          <h1>{t("Your product.")}<br /><em>{t("Always in motion.")}</em></h1>
          <p>{t("Clients and workforce members enter the same studio with an experience matched to their account role.")}</p>
        </div>
        <div className="signinSignal" aria-hidden="true">
          <div><span>{t("CLIENT")}</span><i /></div><div><span>{t("SECURE ACCESS")}</span><i /></div><div><span>{t("WORKFORCE")}</span></div>
        </div>
      </section>

      <section className="authPanel" aria-labelledby="signin-title">
        <div className="authPanelTop"><LanguageSwitcher /><Link href="/">{t("← Back to website")}</Link><span>{t("Need an account?")} <Link href="/signup">{t("Choose account type")}</Link></span></div>
        <form className="authForm signinForm" onSubmit={submit} noValidate>
          {created && <div className="authSuccess"><span>✓</span><div><strong>{t("{type} account created", { type: t(createdType === "client" ? "Client" : "Workforce") })}</strong><p>{t("Sign in to open your Workspace Studio.")}</p></div></div>}
          <div className="authHeading">
            <span>{t("SECURE ACCOUNT ACCESS")}</span>
            <h2 id="signin-title">{t("Welcome back")}</h2>
            <p>{t("Use your email and password or sign in with a one-time mobile code.")}</p>
          </div>

          <div className="authMethodTabs" role="tablist" aria-label={t("Sign-in method")}>
            <button className={method === "password" ? "isActive" : ""} type="button" role="tab" aria-selected={method === "password"} onClick={() => switchMethod("password")}><span>✉</span>{t("Email & password")}</button>
            <button className={method === "otp" ? "isActive" : ""} type="button" role="tab" aria-selected={method === "otp"} onClick={() => switchMethod("otp")}><span>⌁</span>{t("Mobile OTP")}</button>
          </div>

          {method === "password" ? (
            <div className="authFields signinFields">
              <label className="fieldWide"><span>{t("Email address")}</span><input autoFocus type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(""); }} placeholder={t("you@example.com")} autoComplete="email" /></label>
              <label className="fieldWide"><span>{t("Password")}</span><input type="password" value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} placeholder={t("Minimum 8 characters")} autoComplete="current-password" /></label>
            </div>
          ) : (
            <div className="authFields signinFields">
              <label className="fieldWide"><span>{t("Registered mobile number")}</span><input autoFocus type="tel" value={phone} disabled={otpSent} onChange={(event) => { setPhone(event.target.value); setError(""); }} placeholder="+91 98765 43210" autoComplete="tel" /></label>
              {otpSent && <label className="fieldWide"><span>{t("6-digit OTP")}</span><input className="otpInput" value={otp} onChange={(event) => { setOtp(event.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }} placeholder="••••••" inputMode="numeric" autoComplete="one-time-code" /></label>}
              {otpSent && <div className="otpStatus fieldWide"><span>{t("OTP ready for this prototype")}</span><strong>{t("Demo code: 246810")}</strong><button type="button" onClick={() => { setOtpSent(false); setOtp(""); setError(""); }}>{t("Change number")}</button></div>}
            </div>
          )}

          {method === "password" && <div className="signinOptions"><label><input type="checkbox" defaultChecked /> {t("Keep me signed in")}</label><button type="button">{t("Forgot password?")}</button></div>}
          {error && <p className="authError" role="alert">{t(error)}</p>}
          <button className="authPrimary authPrimaryWide" type="submit">{method === "otp" && !otpSent ? t("Send mobile OTP") : t("Open Workspace Studio")} <span>→</span></button>

          <div className="signupRoutes">
            <span>{t("New to Vaniyathans?")}</span>
            <Link href="/signup/client"><i>◎</i><span><strong>{t("Client signup")}</strong><small>{t("Start a project")}</small></span>→</Link>
            <Link href="/signup/workforce"><i>⌘</i><span><strong>{t("Workforce signup")}</strong><small>{t("Join delivery")}</small></span>→</Link>
          </div>
          <p className="authSupport">{t("Account support:")} <a href="mailto:support@vaniyathans.com">{t("support@vaniyathans.com")}</a></p>
          <p className="authDemoNote">{t("This hosted experience demonstrates the complete account flow. A production identity and messaging provider is still required before real passwords or OTPs can be issued.")}</p>
        </form>
      </section>
    </main>
  );
}
