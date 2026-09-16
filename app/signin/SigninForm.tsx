"use client";

import { phoneSchema } from "@/lib/auth/validation";
import PasswordInput from "@/app/PasswordInput";
import { authClient } from "@/lib/auth/client";
import ArrowIcon from "@/app/ArrowIcon";
import { useLocale } from "@/app/i18n/LocaleProvider";

import LanguageSwitcher from "@/app/i18n/LanguageSwitcher";
import Link from "@/app/i18n/LocalizedLink";
import BrandLogo from "@/app/BrandLogo";
import { useLocalizedRouter as useRouter } from "@/app/i18n/LocaleProvider";
import { FormEvent, useState } from "react";

type AccountType = "client" | "workforce";

export default function SigninForm({ initialEmail, created, createdType }: {
  initialEmail: string;
  created: boolean;
  createdType: AccountType;
}) {
  const { t, locale } = useLocale();
  const router = useRouter();
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [phone, setPhone] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneSent, setPhoneSent] = useState(false);
  const [phoneRetryAt, setPhoneRetryAt] = useState(0);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError(""); setNotice(""); setNeedsVerification(false);
    try {
      if (method === "phone") {
        const parsed = phoneSchema.safeParse(phone);
        if (!parsed.success) { setError("Enter a valid mobile number with country code."); return; }
        if (!phoneSent) {
          if (Date.now() < phoneRetryAt) { setError("Please wait a minute before requesting another code."); return; }
          const result = await authClient.phoneNumber.sendOtp({ phoneNumber: parsed.data });
          if (result.error) { setError(result.error.message || "Could not send the code. Please try again shortly."); return; }
          setPhone(parsed.data); setPhoneSent(true); setPhoneRetryAt(Date.now() + 60_000);
          setNotice("Check your phone for a verification code."); return;
        }
        if (!/^\d{6}$/.test(phoneCode)) { setError("Enter the six-digit verification code."); return; }
        const result = await authClient.phoneNumber.verify({ phoneNumber: parsed.data, code: phoneCode });
        if (result.error) { setError("Invalid or expired code. Try again, or sign in with email to link your mobile number."); return; }
        router.replace("/workspace"); router.refresh(); return;
      }
      const { error } = await authClient.signIn.email({ email: email.trim(), password, rememberMe });
      if (error) {
        setNeedsVerification(error.code === "EMAIL_NOT_VERIFIED");
        setError(error.code === "EMAIL_NOT_VERIFIED" ? "Verify your email before signing in." : "Unable to sign in. Check your email and password and try again.");
        return;
      }
      router.replace("/workspace"); router.refresh();
    } catch { setError("Could not reach the server. Please try again."); }
    finally { setBusy(false); }
  };

  const sendEmail = async (kind: "reset" | "verify") => {
    if (busy) return;
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) { setError("Enter a valid email address."); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      const result = kind === "reset"
        ? await authClient.emailOtp.requestPasswordReset({ email: email.trim() })
        : await authClient.emailOtp.sendVerificationOtp({ email: email.trim(), type: "email-verification" });
      if (result.error) { setError("Could not send the email. Please try again shortly."); return; }
      if (kind === "reset") router.push(`/reset-password?email=${encodeURIComponent(email.trim())}`);
      setNotice("If this address is eligible, an email is on its way. Check your inbox and spam folder.");
    } catch { setError("Could not reach the server. Please try again."); }
    finally { setBusy(false); }
  };

  const verifyEmail = async () => {
    if (busy) return;
    setBusy(true); setError("");
    try {
      const { error } = await authClient.emailOtp.verifyEmail({ email: email.trim(), otp: verificationCode });
      if (error) { setError("Invalid or expired verification code. Please try again."); return; }
      setNeedsVerification(false); setNotice("Email verified. You can now sign in.");
    } catch { setError("Could not reach the server. Please try again."); }
    finally { setBusy(false); }
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
        <div className="authPanelTop"><LanguageSwitcher /><Link href="/"><ArrowIcon direction="left" /> {t("Back to website")}</Link><span>{t("Need an account?")} <Link href="/signup">{t("Choose account type")}</Link></span></div>
        <form className="authForm signinForm" onSubmit={submit} noValidate>
          {created && <div className="authSuccess"><span>✓</span><div><strong>{t("{type} account created", { type: t(createdType === "client" ? "Client" : "Workforce") })}</strong><p>{t("Sign in to open your Workspace Studio.")}</p></div></div>}
          <div className="authHeading">
            <span>{t("SECURE ACCOUNT ACCESS")}</span>
            <h2 id="signin-title">{t("Welcome back")}</h2>
            <p>{t("Sign in with your email and password or a mobile verification code.")}</p>
          </div>

          <div className="authMethodTabs" aria-label={t("Sign-in method")}>
            {(["email", "phone"] as const).map(value => <button key={value} type="button" disabled={busy} aria-pressed={method === value} className={method === value ? "isActive" : ""} onClick={() => { setMethod(value); setError(""); setNotice(""); setNeedsVerification(false); }}>{t(value === "email" ? "Email and password" : "Mobile OTP")}</button>)}
          </div>
          {method === "phone" ? <div className="authFields signinFields">
            <label className="fieldWide"><span>{t("Mobile number")}</span><input type="tel" autoComplete="tel" placeholder="+91 98765 43210" value={phone} disabled={busy || phoneSent} onChange={e => setPhone(e.target.value)} /></label>
            {phoneSent && <>
              <label className="fieldWide"><span>{t("Verification code")}</span><input className="otpInput" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={phoneCode} onChange={e => setPhoneCode(e.target.value.replace(/\D/g, ""))} /></label>
              <button type="button" disabled={busy} onClick={() => { setPhoneSent(false); setPhoneCode(""); setNotice(""); setError(""); }}>{t("Change number or request a new code")}</button>
            </>}
          </div> : <>
            <div className="authFields signinFields">
              <label className="fieldWide"><span>{t("Email address")}</span><input autoFocus type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(""); }} placeholder={t("you@example.com")} autoComplete="email" /></label>
              <label className="fieldWide"><span>{t("Password")}</span><PasswordInput value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} placeholder={t("Minimum 8 characters")} autoComplete="current-password" /></label>
            </div>
          <div className="signinOptions"><label><input type="checkbox" checked={rememberMe} onChange={event => setRememberMe(event.target.checked)} /> {t("Keep me signed in")}</label><button type="button" disabled={busy} onClick={() => sendEmail("reset")}>{t("Forgot password?")}</button></div></>}
          {notice && <p role="status">{t(notice)}</p>}
          {needsVerification && <><label>{t("Email verification code")}<input inputMode="numeric" autoComplete="one-time-code" value={verificationCode} onChange={e => setVerificationCode(e.target.value)} /></label><button type="button" disabled={busy} onClick={verifyEmail}>{t("Verify email")}</button><button type="button" disabled={busy} onClick={() => sendEmail("verify")}>{t("Resend verification email")}</button></>}
          {error && <p className="authError" role="alert">{t(error)}</p>}
          <button className="authPrimary authPrimaryWide" type="submit" disabled={busy}>{busy ? t("Please wait…") : method === "phone" && !phoneSent ? t("Send verification code") : t("Open Workspace Studio")} <ArrowIcon /></button>

          <div className="signupRoutes">
            <span>{t("New to Vaniyathans?")}</span>
            <Link href="/signup/client"><i>◎</i><span><strong>{t("Client signup")}</strong><small>{t("Start a project")}</small></span><ArrowIcon /></Link>
            <Link href="/signup/workforce"><i>⌘</i><span><strong>{t("Workforce signup")}</strong><small>{t("Join delivery")}</small></span><ArrowIcon /></Link>
          </div>
          <p className="authSupport">{t("Account support:")} <a href="mailto:support@vaniyathans.com">{t("support@vaniyathans.com")}</a></p>
        </form>
      </section>
    </main>
  );
}
