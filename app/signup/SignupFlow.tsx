"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
const phoneIsValid = (phone: string) => phone.replace(/\D/g, "").length >= 10;

export default function SignupFlow({ accountType }: { accountType: AccountType }) {
  const router = useRouter();
  const isClient = accountType === "client";
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initialData);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  const update = (field: keyof SignupData, value: string) => {
    setData((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const validateStep = () => {
    const fields = (isClient ? clientFields : workforceFields)[step];
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
    if (step === 0 && !passwordIsStrong(data.password)) {
      setError("Use at least 8 characters with uppercase, lowercase, and a number.");
      return false;
    }
    if (step === 0 && data.password !== data.confirmPassword) {
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

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateStep()) return;

    const { password: _password, confirmPassword: _confirmPassword, ...safeData } = data;
    void _password;
    void _confirmPassword;
    const profile = { ...safeData, accountType };
    localStorage.setItem(`vss_${accountType}_profile`, JSON.stringify(profile));
    localStorage.setItem("vss_profile", JSON.stringify(profile));
    router.push(`/signin?created=1&type=${accountType}&email=${encodeURIComponent(data.email)}`);
  };

  const heading = isClient
    ? ["Create your client account", "Frame your first Epic", "Set delivery context"]
    : ["Create your workforce account", "Map your expertise", "Set your availability"];
  const description = isClient
    ? ["Set secure account access for your product team.", "Give the workforce enough context to structure the work.", "Help us shape the right starting plan for your team."]
    : ["Set secure access for your delivery profile.", "Tell us where you create the most value.", "Help us match you with the right global delivery window."];

  return (
    <main className={`authPage ${isClient ? "clientSignup" : "workforceSignup"}`}>
      <section className="authStory" aria-label={`Vaniyathans ${accountType} onboarding`}>
        <Link className="authLogo" href="/">VANIYATHANS</Link>
        <div className="authStoryCopy">
          <p className="authEyebrow"><span /> {isClient ? "CLIENT ONBOARDING · PROJECT INTAKE" : "WORKFORCE ONBOARDING · GLOBAL DELIVERY"}</p>
          <span className="accountTypeBadge">{isClient ? "CLIENT" : "WORKFORCE"}</span>
          <h1>{isClient ? <>Turn your first<br /><em>Epic into momentum.</em></> : <>Build globally.<br /><em>Deliver continuously.</em></>}</h1>
          <p>{isClient ? "Tell us what you want to build. Your brief becomes the first structured Epic inside Workspace Studio." : "Bring your expertise into a 24/7 product workforce and collaborate from Epic through deployment."}</p>
        </div>
        <div className="authJourney" aria-hidden="true">
          <span className={step >= 0 ? "isActive" : ""}>ACCOUNT</span><i />
          <span className={step >= 1 ? "isActive" : ""}>{isClient ? "EPIC" : "EXPERTISE"}</span><i />
          <span className={step >= 2 ? "isActive" : ""}>{isClient ? "DELIVERY" : "AVAILABILITY"}</span>
        </div>
      </section>

      <section className="authPanel" aria-labelledby="signup-title">
        <div className="authPanelTop">
          <Link href="/signup">← Choose account type</Link>
          <span>Already registered? <Link href="/signin">Sign in</Link></span>
        </div>

        <form className="authForm" onSubmit={submit} noValidate>
          <div className="authProgress" aria-label={`Step ${step + 1} of 3`}>
            {[0, 1, 2].map((item) => <span className={item <= step ? "isActive" : ""} key={item} />)}
          </div>

          <div className="authHeading">
            <span>STEP 0{step + 1} / 03 · {accountType.toUpperCase()}</span>
            <h2 id="signup-title">{heading[step]}</h2>
            <p>{description[step]}</p>
          </div>

          {step === 0 && (
            <div className="authFields">
              <label className="fieldWide"><span>Full name</span><input autoFocus value={data.fullName} onChange={(event) => update("fullName", event.target.value)} placeholder="Your full name" autoComplete="name" /></label>
              <label className="fieldWide"><span>Email address</span><input type="email" value={data.email} onChange={(event) => update("email", event.target.value)} placeholder={isClient ? "you@company.com" : "you@example.com"} autoComplete="email" /></label>
              <label className="fieldWide"><span>Mobile number</span><input type="tel" value={data.phone} onChange={(event) => update("phone", event.target.value)} placeholder="+91 98765 43210" autoComplete="tel" /></label>
              <label><span>Password</span><input type="password" value={data.password} onChange={(event) => update("password", event.target.value)} placeholder="Create password" autoComplete="new-password" /></label>
              <label><span>Confirm password</span><input type="password" value={data.confirmPassword} onChange={(event) => update("confirmPassword", event.target.value)} placeholder="Repeat password" autoComplete="new-password" /></label>
              <p className="passwordHint fieldWide">Minimum 8 characters with uppercase, lowercase, and a number. Your mobile number can also be used for OTP sign-in.</p>
            </div>
          )}

          {step === 1 && isClient && (
            <div className="authFields">
              <label><span>Company</span><input autoFocus value={data.company} onChange={(event) => update("company", event.target.value)} placeholder="Company name" autoComplete="organization" /></label>
              <label><span>Your role</span><select value={data.role} onChange={(event) => update("role", event.target.value)}><option value="">Select your role</option><option>Founder / Owner</option><option>Product Leader</option><option>Technology Leader</option><option>Operations Leader</option><option>Other</option></select></label>
              <label><span>Project name</span><input value={data.projectName} onChange={(event) => update("projectName", event.target.value)} placeholder="e.g. Customer Portal" /></label>
              <label><span>Epic title</span><input value={data.epic} onChange={(event) => update("epic", event.target.value)} placeholder="e.g. Self-serve onboarding" /></label>
              <label className="fieldWide"><span>Outcome you need</span><textarea value={data.outcome} onChange={(event) => update("outcome", event.target.value)} placeholder="What should change for your business or customers?" rows={3} /></label>
              <label className="fieldWide"><span>Primary users</span><input value={data.users} onChange={(event) => update("users", event.target.value)} placeholder="Who will use this product?" /></label>
            </div>
          )}

          {step === 1 && !isClient && (
            <div className="authFields">
              <label><span>Primary role</span><select autoFocus value={data.primaryRole} onChange={(event) => update("primaryRole", event.target.value)}><option value="">Select role</option><option>Product / Business Analyst</option><option>UI / UX Designer</option><option>Frontend Engineer</option><option>Backend Engineer</option><option>Full-stack Engineer</option><option>QA Engineer</option><option>DevOps / Cloud Engineer</option><option>Delivery Lead</option></select></label>
              <label><span>Experience</span><select value={data.experience} onChange={(event) => update("experience", event.target.value)}><option value="">Select experience</option><option>0–2 years</option><option>3–5 years</option><option>6–9 years</option><option>10+ years</option></select></label>
              <label className="fieldWide"><span>Core skills</span><textarea value={data.skills} onChange={(event) => update("skills", event.target.value)} placeholder="e.g. React, Node.js, AWS, product discovery" rows={3} /></label>
              <label className="fieldWide"><span>Timezone</span><select value={data.timezone} onChange={(event) => update("timezone", event.target.value)}><option value="">Select your timezone</option><option>Asia / India (IST)</option><option>Europe / Africa (GMT–CET)</option><option>Americas (EST–PST)</option><option>Asia Pacific (SGT–AEST)</option></select></label>
            </div>
          )}

          {step === 2 && isClient && (
            <div className="authFields">
              <label className="fieldWide"><span>Target timeline</span><select autoFocus value={data.timeline} onChange={(event) => update("timeline", event.target.value)}><option value="">Choose a timeline</option><option>Immediate — start this week</option><option>2–4 weeks</option><option>1–3 months</option><option>Exploring options</option></select></label>
              <label className="fieldWide"><span>Indicative budget</span><select value={data.budget} onChange={(event) => update("budget", event.target.value)}><option value="">Choose a range</option><option>₹1L–₹5L</option><option>₹5L–₹15L</option><option>₹15L–₹50L</option><option>₹50L+</option><option>Not decided yet</option></select></label>
              <div className="signupSummary fieldWide"><span>YOUR WORKSPACE STARTS WITH</span><strong>{data.epic || "Your first Epic"}</strong><small>{data.projectName || "New product workspace"} · {data.timeline || "Timeline pending"}</small></div>
            </div>
          )}

          {step === 2 && !isClient && (
            <div className="authFields">
              <label><span>Location</span><input autoFocus value={data.location} onChange={(event) => update("location", event.target.value)} placeholder="City, country" autoComplete="address-level2" /></label>
              <label><span>Weekly availability</span><select value={data.availability} onChange={(event) => update("availability", event.target.value)}><option value="">Select availability</option><option>10–20 hours / week</option><option>20–30 hours / week</option><option>30–40 hours / week</option><option>Full-time availability</option></select></label>
              <label className="fieldWide"><span>Portfolio or profile URL <small>OPTIONAL</small></span><input type="url" value={data.portfolio} onChange={(event) => update("portfolio", event.target.value)} placeholder="https://linkedin.com/in/your-profile" /></label>
              <div className="signupSummary workforceSummary fieldWide"><span>WORKFORCE PROFILE</span><strong>{data.primaryRole || "Your delivery role"}</strong><small>{data.skills || "Skills pending"} · {data.availability || "Availability pending"}</small></div>
            </div>
          )}

          {step === 2 && <label className="authConsent"><input type="checkbox" checked={agreed} onChange={(event) => { setAgreed(event.target.checked); setError(""); }} /><span>I agree to the terms and allow Vaniyathans to use this information to create and operate my {accountType} account.</span></label>}
          {error && <p className="authError" role="alert">{error}</p>}

          <div className="authActions">
            {step > 0 ? <button className="authBack" type="button" onClick={() => { setStep((current) => current - 1); setError(""); }}>← Previous</button> : <span />}
            {step < 2 ? <button className="authPrimary" type="button" onClick={next}>Continue <span>→</span></button> : <button className="authPrimary" type="submit">Create {accountType} account <span>→</span></button>}
          </div>
          <p className="authSupport">Need account help? <a href="mailto:support@vaniyathans.com">support@vaniyathans.com</a></p>
        </form>
      </section>
    </main>
  );
}
