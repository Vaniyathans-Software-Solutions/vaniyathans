"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type SignupData = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  projectName: string;
  epic: string;
  outcome: string;
  users: string;
  timeline: string;
  budget: string;
};

const initialData: SignupData = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  role: "",
  projectName: "",
  epic: "",
  outcome: "",
  users: "",
  timeline: "",
  budget: "",
};

const stepFields: Array<Array<keyof SignupData>> = [
  ["fullName", "email", "phone", "company", "role"],
  ["projectName", "epic", "outcome", "users"],
  ["timeline", "budget"],
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initialData);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  const update = (field: keyof SignupData, value: string) => {
    setData((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const validateStep = () => {
    const missing = stepFields[step].some((field) => !data[field].trim());
    if (missing) {
      setError("Please complete every field before continuing.");
      return false;
    }
    if (step === 0 && !/^\S+@\S+\.\S+$/.test(data.email)) {
      setError("Enter a valid work email address.");
      return false;
    }
    if (step === 2 && !agreed) {
      setError("Please accept the terms to create your workspace.");
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
    localStorage.setItem("vss_profile", JSON.stringify(data));
    router.push(`/signin?created=1&email=${encodeURIComponent(data.email)}`);
  };

  return (
    <main className="authPage">
      <section className="authStory" aria-label="Vaniyathans onboarding">
        <Link className="authLogo" href="/">VANIYATHANS</Link>
        <div className="authStoryCopy">
          <p className="authEyebrow"><span /> PROJECT INTAKE · 24/7 DELIVERY</p>
          <h1>Turn your first<br /><em>Epic into momentum.</em></h1>
          <p>Tell us what you want to build. Your brief becomes the first structured epic inside Workspace Studio.</p>
        </div>
        <div className="authJourney" aria-hidden="true">
          <span className={step >= 0 ? "isActive" : ""}>DREAM</span><i />
          <span className={step >= 1 ? "isActive" : ""}>DEFINE</span><i />
          <span className={step >= 2 ? "isActive" : ""}>DELIVER</span>
        </div>
      </section>

      <section className="authPanel" aria-labelledby="signup-title">
        <div className="authPanelTop">
          <Link href="/">← Back to website</Link>
          <span>Already registered? <Link href="/signin">Sign in</Link></span>
        </div>

        <form className="authForm" onSubmit={submit} noValidate>
          <div className="authProgress" aria-label={`Step ${step + 1} of 3`}>
            {[0, 1, 2].map((item) => <span className={item <= step ? "isActive" : ""} key={item} />)}
          </div>

          <div className="authHeading">
            <span>STEP 0{step + 1} / 03</span>
            <h2 id="signup-title">{step === 0 ? "Create your account" : step === 1 ? "Frame your first Epic" : "Set delivery context"}</h2>
            <p>{step === 0 ? "Start with the people and company behind the product." : step === 1 ? "Give the workforce enough context to structure the work." : "Help us shape the right starting plan for your team."}</p>
          </div>

          {step === 0 && (
            <div className="authFields">
              <label className="fieldWide"><span>Full name</span><input autoFocus value={data.fullName} onChange={(event) => update("fullName", event.target.value)} placeholder="Your full name" autoComplete="name" /></label>
              <label className="fieldWide"><span>Work email</span><input type="email" value={data.email} onChange={(event) => update("email", event.target.value)} placeholder="you@company.com" autoComplete="email" /></label>
              <label><span>Phone</span><input type="tel" value={data.phone} onChange={(event) => update("phone", event.target.value)} placeholder="+91 98765 43210" autoComplete="tel" /></label>
              <label><span>Company</span><input value={data.company} onChange={(event) => update("company", event.target.value)} placeholder="Company name" autoComplete="organization" /></label>
              <label className="fieldWide"><span>Your role</span><select value={data.role} onChange={(event) => update("role", event.target.value)}><option value="">Select your role</option><option>Founder / Owner</option><option>Product Leader</option><option>Technology Leader</option><option>Operations Leader</option><option>Other</option></select></label>
            </div>
          )}

          {step === 1 && (
            <div className="authFields">
              <label><span>Project name</span><input autoFocus value={data.projectName} onChange={(event) => update("projectName", event.target.value)} placeholder="e.g. Customer Portal" /></label>
              <label><span>Epic title</span><input value={data.epic} onChange={(event) => update("epic", event.target.value)} placeholder="e.g. Self-serve onboarding" /></label>
              <label className="fieldWide"><span>Outcome you need</span><textarea value={data.outcome} onChange={(event) => update("outcome", event.target.value)} placeholder="What should change for your business or customers?" rows={4} /></label>
              <label className="fieldWide"><span>Primary users</span><input value={data.users} onChange={(event) => update("users", event.target.value)} placeholder="Who will use this product?" /></label>
            </div>
          )}

          {step === 2 && (
            <div className="authFields">
              <label className="fieldWide"><span>Target timeline</span><select autoFocus value={data.timeline} onChange={(event) => update("timeline", event.target.value)}><option value="">Choose a timeline</option><option>Immediate — start this week</option><option>2–4 weeks</option><option>1–3 months</option><option>Exploring options</option></select></label>
              <label className="fieldWide"><span>Indicative budget</span><select value={data.budget} onChange={(event) => update("budget", event.target.value)}><option value="">Choose a range</option><option>₹1L–₹5L</option><option>₹5L–₹15L</option><option>₹15L–₹50L</option><option>₹50L+</option><option>Not decided yet</option></select></label>
              <label className="authConsent fieldWide"><input type="checkbox" checked={agreed} onChange={(event) => { setAgreed(event.target.checked); setError(""); }} /><span>I agree to the terms and allow Vaniyathans to use this information to prepare my project workspace.</span></label>
              <div className="signupSummary fieldWide"><span>YOUR WORKSPACE STARTS WITH</span><strong>{data.epic || "Your first Epic"}</strong><small>{data.projectName || "New product workspace"} · {data.timeline || "Timeline pending"}</small></div>
            </div>
          )}

          {error && <p className="authError" role="alert">{error}</p>}

          <div className="authActions">
            {step > 0 ? <button className="authBack" type="button" onClick={() => { setStep((current) => current - 1); setError(""); }}>← Previous</button> : <span />}
            {step < 2 ? <button className="authPrimary" type="button" onClick={next}>Continue <span>→</span></button> : <button className="authPrimary" type="submit">Create workspace <span>→</span></button>}
          </div>
        </form>
      </section>
    </main>
  );
}
