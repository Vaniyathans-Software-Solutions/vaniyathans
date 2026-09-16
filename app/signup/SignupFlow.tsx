"use client";

import ContactVerification from "@/app/ContactVerification";
import PasswordInput from "@/app/PasswordInput";
import { authClient } from "@/lib/auth/client";
import { onboardingSchema, phoneSchema } from "@/lib/auth/validation";
import { localizePath } from "@/app/i18n/shared";
import ArrowIcon from "@/app/ArrowIcon";
import { useLocale } from "@/app/i18n/LocaleProvider";

import LanguageSwitcher from "@/app/i18n/LanguageSwitcher";
import Link from "@/app/i18n/LocalizedLink";
import BrandLogo from "@/app/BrandLogo";
import { useLocalizedRouter as useRouter } from "@/app/i18n/LocaleProvider";
import { FormEvent, useState } from "react";

export type AccountType = "client" | "workforce";

type SignupData = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  company: string;
  role: string;
  projectName: string;
  epic: string;
  outcome: string;
  users: string;
  timeline: string;
  budget: string;
  primaryRole: string;
  experience: string;
  skills: string;
  timezone: string;
  location: string;
  availability: string;
  portfolio: string;
};

const initialData: SignupData = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  company: "",
  role: "",
  projectName: "",
  epic: "",
  outcome: "",
  users: "",
  timeline: "",
  budget: "",
  primaryRole: "",
  experience: "",
  skills: "",
  timezone: "",
  location: "",
  availability: "",
  portfolio: "",
};

const commonFields: Array<keyof SignupData> = ["fullName", "email", "phone", "password", "confirmPassword"];
const clientFields: Array<Array<keyof SignupData>> = [
  commonFields,
  ["company", "role", "projectName", "epic", "outcome", "users"],
  ["timeline", "budget"],
];
const workforceFields: Array<Array<keyof SignupData>> = [
  commonFields,
  ["primaryRole", "experience", "skills", "timezone"],
  ["location", "availability"],
];

const passwordIsStrong = (password: string) => password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);
const phoneIsValid = (phone: string) => phoneSchema.safeParse(phone).success;

export default function SignupFlow({ accountType, existingUser }: { accountType: AccountType; existingUser?: { name: string; email: string } }) {
  const { t, locale } = useLocale();
  const router = useRouter();
  const isClient = accountType === "client";
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ ...initialData, fullName: existingUser?.name ?? "", email: existingUser?.email ?? "" });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [registered, setRegistered] = useState(!!existingUser);
  const [verifying, setVerifying] = useState(false);

  const update = (field: keyof SignupData, value: string) => {
    setData((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const validateStep = () => {
    const fields = (isClient ? clientFields : workforceFields)[step].filter(field => !registered || !["password", "confirmPassword"].includes(field));
    if (fields.some((field) => !data[field].trim())) {
      setError("Please complete every required field before continuing.");
      return false;
    }
    if (step === 0 && !/^\S+@\S+\.\S+$/.test(data.email)) {
      setError("Enter a valid email address.");
      return false;
    }
    if (step === 0 && !phoneIsValid(data.phone)) {
      setError("Enter a valid mobile number with country code.");
      return false;
    }
    if (step === 0 && !registered && !passwordIsStrong(data.password)) {
      setError("Use at least 8 characters with uppercase, lowercase, and a number.");
      return false;
    }
    if (step === 0 && !registered && data.password !== data.confirmPassword) {
      setError("The passwords do not match.");
      return false;
    }
    if (step === 2 && !agreed) {
      setError("Please accept the terms to create your account.");
      return false;
    }
    return true;
  };

  const next = () => {
    if (validateStep()) setStep((current) => Math.min(2, current + 1));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy || verifying || !validateStep()) return;
    // Enter on an earlier step advances the wizard instead of registering early.
    if (step < 2) { next(); return; }
    const parsed = onboardingSchema.safeParse({ ...data, accountType, locale, agreed });
    if (!parsed.success) { setError(parsed.error.issues[0].message); return; }
    setBusy(true);
    setError("");
    try {
      if (!registered) {
        const result = await authClient.signUp.email({ name: data.fullName.trim(), email: data.email.trim(),
          password: data.password, callbackURL: localizePath("/workspace", locale) });
        if (result.error) { setError(result.error.message || "Could not create your account."); return; }
        setRegistered(true);
        setData(current => ({ ...current, password: "", confirmPassword: "" }));
      }
      const { data: session } = await authClient.getSession({ query: { disableCookieCache: true } });
      if (!session?.user?.emailVerified || !session.user.phoneNumberVerified || session.user.phoneNumber !== parsed.data.phone) {
        setVerifying(true);
        return;
      }
      const response = await fetch("/api/onboarding", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
      const result = await response.json();
      if (!response.ok) { setError(result.error || "Could not save your profile. Please try again."); return; }
      router.replace("/workspace");
      router.refresh();
    } catch { setError("Could not reach the server. Please try again."); }
    finally { setBusy(false); }
  };

  const heading = isClient
    ? ["Create your client account", "Frame your first Epic", "Set delivery context"]
    : ["Create your workforce account", "Map your expertise", "Set your availability"];
  const description = isClient
    ? ["Set secure account access for your product team.", "Give the workforce enough context to structure the work.", "Help us shape the right starting plan for your team."]
    : ["Set secure access for your delivery profile.", "Tell us where you create the most value.", "Help us match you with the right global delivery window."];

  return (
    <main className={`authPage ${isClient ? "clientSignup" : "workforceSignup"}`}>
      <section className="authStory" aria-label={t("Create {type} account", { type: t(accountType) })}>
        <Link className="authLogo" href="/" aria-label={t("Vaniyathans home")}>
          <BrandLogo locale={locale} preload />
        </Link>
        <div className="authStoryCopy">
          <p className="authEyebrow"><span /> {isClient ? t("CLIENT ONBOARDING · PROJECT INTAKE") : t("WORKFORCE ONBOARDING · GLOBAL DELIVERY")}</p>
          <span className="accountTypeBadge">{isClient ? t("CLIENT") : t("WORKFORCE")}</span>
          <h1>{isClient ? <>{t("Turn your first")}<br /><em>{t("Epic into momentum.")}</em></> : <>{t("Build globally.")}<br /><em>{t("Deliver continuously.")}</em></>}</h1>
          <p>{isClient ? t("Tell us what you want to build. Your brief becomes the first structured Epic inside Workspace Studio.") : t("Bring your expertise into a 24/7 product workforce and collaborate from Epic through deployment.")}</p>
        </div>
        <div className="authJourney" aria-hidden="true">
          <span className={step >= 0 ? "isActive" : ""}>{t("ACCOUNT")}</span><i />
          <span className={step >= 1 ? "isActive" : ""}>{isClient ? t("EPIC") : t("EXPERTISE")}</span><i />
          <span className={step >= 2 ? "isActive" : ""}>{isClient ? t("DELIVERY") : t("AVAILABILITY")}</span>
        </div>
      </section>

      <section className="authPanel" aria-labelledby="signup-title">
        <div className="authPanelTop"><LanguageSwitcher />
          <Link href="/signup"><ArrowIcon direction="left" /> {t("Choose account type")}</Link>
          <span>{t("Already registered?")} <Link href="/signin">{t("Sign in")}</Link></span>
        </div>

        <form className="authForm" onSubmit={submit} noValidate>
          <div className="authProgress" aria-label={t("Step {step} of 3", { step: step + 1 })}>
            {[0, 1, 2].map((item) => <span className={item <= step ? "isActive" : ""} key={item} />)}
          </div>

          <div className="authHeading">
            <span>{t("STEP {step} / 03 · {type}", { step: `0${step + 1}`, type: t(accountType.toUpperCase()) })}</span>
            <h2 id="signup-title">{t(heading[step])}</h2>
            <p>{t(description[step])}</p>
          </div>

          {!verifying && step === 0 && (
            <div className="authFields">
              <label className="fieldWide"><span>{t("Full name")}</span><input autoFocus value={data.fullName} onChange={(event) => update("fullName", event.target.value)} placeholder={t("Your full name")} disabled={registered} autoComplete="name" /></label>
              <label className="fieldWide"><span>{t("Email address")}</span><input type="email" value={data.email} onChange={(event) => update("email", event.target.value)} placeholder={isClient ? t("you@company.com") : t("you@example.com")} disabled={registered} autoComplete="email" /></label>
              <label className="fieldWide"><span>{t("Mobile number")}</span><input type="tel" value={data.phone} onChange={(event) => update("phone", event.target.value)} placeholder="+91 98765 43210" autoComplete="tel" /></label>
              {!registered && <><label><span>{t("Password")}</span><PasswordInput value={data.password} onChange={(event) => update("password", event.target.value)} placeholder={t("Create password")} autoComplete="new-password" /></label>
              <label><span>{t("Confirm password")}</span><PasswordInput value={data.confirmPassword} onChange={(event) => update("confirmPassword", event.target.value)} placeholder={t("Repeat password")} autoComplete="new-password" /></label>
              <p className="passwordHint fieldWide">{t("Minimum 8 characters with uppercase, lowercase, and a number. Keep your password private.")}</p></>}
            </div>
          )}

          {!verifying && step === 1 && isClient && (
            <div className="authFields">
              <label><span>{t("Company")}</span><input autoFocus value={data.company} onChange={(event) => update("company", event.target.value)} placeholder={t("Company name")} autoComplete="organization" /></label>
              <label><span>{t("Your role")}</span><select value={data.role} onChange={(event) => update("role", event.target.value)}><option value="">{t("Select your role")}</option><option value="Founder / Owner">{t("Founder / Owner")}</option><option value="Product Leader">{t("Product Leader")}</option><option value="Technology Leader">{t("Technology Leader")}</option><option value="Operations Leader">{t("Operations Leader")}</option><option value="Other">{t("Other")}</option></select></label>
              <label><span>{t("Project name")}</span><input value={data.projectName} onChange={(event) => update("projectName", event.target.value)} placeholder={t("e.g. Customer Portal")} /></label>
              <label><span>{t("Epic title")}</span><input value={data.epic} onChange={(event) => update("epic", event.target.value)} placeholder={t("e.g. Self-serve onboarding")} /></label>
              <label className="fieldWide"><span>{t("Outcome you need")}</span><textarea value={data.outcome} onChange={(event) => update("outcome", event.target.value)} placeholder={t("What should change for your business or customers?")} rows={3} /></label>
              <label className="fieldWide"><span>{t("Primary users")}</span><input value={data.users} onChange={(event) => update("users", event.target.value)} placeholder={t("Who will use this product?")} /></label>
            </div>
          )}

          {!verifying && step === 1 && !isClient && (
            <div className="authFields">
              <label><span>{t("Primary role")}</span><select autoFocus value={data.primaryRole} onChange={(event) => update("primaryRole", event.target.value)}><option value="">{t("Select role")}</option><option value="Product / Business Analyst">{t("Product / Business Analyst")}</option><option value="UI / UX Designer">{t("UI / UX Designer")}</option><option value="Frontend Engineer">{t("Frontend Engineer")}</option><option value="Backend Engineer">{t("Backend Engineer")}</option><option value="Full-stack Engineer">{t("Full-stack Engineer")}</option><option value="QA Engineer">{t("QA Engineer")}</option><option value="DevOps / Cloud Engineer">{t("DevOps / Cloud Engineer")}</option><option value="Delivery Lead">{t("Delivery Lead")}</option></select></label>
              <label><span>{t("Experience")}</span><select value={data.experience} onChange={(event) => update("experience", event.target.value)}><option value="">{t("Select experience")}</option><option value="0–2 years">{t("0–2 years")}</option><option value="3–5 years">{t("3–5 years")}</option><option value="6–9 years">{t("6–9 years")}</option><option value="10+ years">{t("10+ years")}</option></select></label>
              <label className="fieldWide"><span>{t("Core skills")}</span><textarea value={data.skills} onChange={(event) => update("skills", event.target.value)} placeholder={t("e.g. React, Node.js, AWS, product discovery")} rows={3} /></label>
              <label className="fieldWide"><span>{t("Timezone")}</span><select value={data.timezone} onChange={(event) => update("timezone", event.target.value)}><option value="">{t("Select your timezone")}</option><option value="Asia / India (IST)">{t("Asia / India (IST)")}</option><option value="Europe / Africa (GMT–CET)">{t("Europe / Africa (GMT–CET)")}</option><option value="Americas (EST–PST)">{t("Americas (EST–PST)")}</option><option value="Asia Pacific (SGT–AEST)">{t("Asia Pacific (SGT–AEST)")}</option></select></label>
            </div>
          )}

          {!verifying && step === 2 && isClient && (
            <div className="authFields">
              <label className="fieldWide"><span>{t("Target timeline")}</span><select autoFocus value={data.timeline} onChange={(event) => update("timeline", event.target.value)}><option value="">{t("Choose a timeline")}</option><option value="Immediate — start this week">{t("Immediate — start this week")}</option><option value="2–4 weeks">{t("2–4 weeks")}</option><option value="1–3 months">{t("1–3 months")}</option><option value="Exploring options">{t("Exploring options")}</option></select></label>
              <label className="fieldWide"><span>{t("Indicative budget")}</span><select value={data.budget} onChange={(event) => update("budget", event.target.value)}><option value="">{t("Choose a range")}</option><option value="₹1L–₹5L">{t("₹1L–₹5L")}</option><option value="₹5L–₹15L">{t("₹5L–₹15L")}</option><option value="₹15L–₹50L">{t("₹15L–₹50L")}</option><option value="₹50L+">{t("₹50L+")}</option><option value="Not decided yet">{t("Not decided yet")}</option></select></label>
              <div className="signupSummary fieldWide"><span>{t("YOUR WORKSPACE STARTS WITH")}</span><strong>{data.epic || t("Your first Epic")}</strong><small>{data.projectName || t("New product workspace")} · {data.timeline ? t(data.timeline) : t("Timeline pending")}</small></div>
            </div>
          )}

          {!verifying && step === 2 && !isClient && (
            <div className="authFields">
              <label><span>{t("Location")}</span><input autoFocus value={data.location} onChange={(event) => update("location", event.target.value)} placeholder={t("City, country")} autoComplete="address-level2" /></label>
              <label><span>{t("Weekly availability")}</span><select value={data.availability} onChange={(event) => update("availability", event.target.value)}><option value="">{t("Select availability")}</option><option value="10–20 hours / week">{t("10–20 hours / week")}</option><option value="20–30 hours / week">{t("20–30 hours / week")}</option><option value="30–40 hours / week">{t("30–40 hours / week")}</option><option value="Full-time availability">{t("Full-time availability")}</option></select></label>
              <label className="fieldWide"><span>{t("Portfolio or profile URL")} <small>{t("OPTIONAL")}</small></span><input type="url" value={data.portfolio} onChange={(event) => update("portfolio", event.target.value)} placeholder={t("https://linkedin.com/in/your-profile")} /></label>
              <div className="signupSummary workforceSummary fieldWide"><span>{t("WORKFORCE PROFILE")}</span><strong>{data.primaryRole ? t(data.primaryRole) : t("Your delivery role")}</strong><small>{data.skills || t("Skills pending")} · {data.availability ? t(data.availability) : t("Availability pending")}</small></div>
            </div>
          )}

          {!verifying && step === 2 && <label className="authConsent"><input type="checkbox" checked={agreed} onChange={(event) => { setAgreed(event.target.checked); setError(""); }} /><span>{t("I agree to the terms and allow Vaniyathans to use this information to create and operate my {type} account.", { type: t(accountType) })}</span></label>}
          {verifying && <ContactVerification email={data.email.trim()} initialPhone={data.phone} onVerified={phone => { update("phone", phone); setVerifying(false); }} />}
          {error && <p className="authError" role="alert">{t(error)}</p>}

          {!verifying && <div className="authActions">
            {step > 0 ? <button className="authBack" type="button" onClick={() => { setStep((current) => current - 1); setError(""); }}><ArrowIcon direction="left" /> {t("Previous")}</button> : <span />}
            {step < 2 ? <button className="authPrimary" type="button" onClick={next}>{t("Continue")} <ArrowIcon /></button> : <button className="authPrimary" type="submit" disabled={busy}>{busy ? t("Saving…") : registered ? t("Finish your profile") : t("Create {type} account", { type: t(accountType) })} <ArrowIcon /></button>}
          </div>}
          <p className="authSupport">{t("Need account help?")} <a href="mailto:support@vaniyathans.com">{t("support@vaniyathans.com")}</a></p>
        </form>
      </section>
    </main>
  );
}
