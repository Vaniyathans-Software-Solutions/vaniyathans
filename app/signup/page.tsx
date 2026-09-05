import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Create an account | Vaniyathans",
  description: "Choose a dedicated Vaniyathans account for starting a software project or joining the global workforce.",
  openGraph: {
    title: "Choose your Vaniyathans account",
    description: "Create a client account or join the Vaniyathans global workforce.",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Choose your Vaniyathans account",
    description: "Create a client account or join the Vaniyathans global workforce.",
    images: [],
  },
};

export default function SignupPage() {
  return (
    <main className="accountChoicePage">
      <header className="accountChoiceHeader">
        <Link className="authLogo" href="/" aria-label="Vaniyathans home">
          <Image src="/vaniyathans-logo-2026.png" alt="Vaniyathans Software Solutions" width={1984} height={793} preload />
        </Link>
        <Link href="/signin">Already registered? <strong>Sign in →</strong></Link>
      </header>

      <section className="accountChoiceIntro" aria-labelledby="account-choice-title">
        <p className="authEyebrow"><span /> TWO JOURNEYS · ONE DELIVERY STUDIO</p>
        <h1 id="account-choice-title">Choose how you want<br /><em>to build with us.</em></h1>
        <p>Each account has its own shareable registration link. Both use the same secure sign-in and collaborate inside Workspace Studio.</p>
      </section>

      <section className="accountChoiceGrid" aria-label="Account types">
        <article className="accountChoiceCard clientChoice">
          <div className="accountChoiceIcon" aria-hidden="true">◎</div>
          <span>CLIENT ACCOUNT</span>
          <h2>Start a software project</h2>
          <p>Share your vision, frame the first Epic, and follow delivery from backlog to deployment.</p>
          <ul><li>Project intake and workspace setup</li><li>Live Kanban, backlog, and analytics</li><li>Direct visibility into delivery</li></ul>
          <Link href="/signup/client">Create client account <span>→</span></Link>
        </article>

        <article className="accountChoiceCard workforceChoice">
          <div className="accountChoiceIcon" aria-hidden="true">⌘</div>
          <span>WORKFORCE ACCOUNT</span>
          <h2>Join the delivery workforce</h2>
          <p>Register your expertise, availability, and timezone to work on structured product delivery.</p>
          <ul><li>Skills and experience profile</li><li>Assigned work and project context</li><li>Epic-to-subtask collaboration</li></ul>
          <Link href="/signup/workforce">Create workforce account <span>→</span></Link>
        </article>
      </section>

      <footer className="accountChoiceFooter">Need help choosing? <a href="mailto:support@vaniyathans.com">support@vaniyathans.com</a></footer>
    </main>
  );
}
