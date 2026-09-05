import Link from "next/link";
import Image from "next/image";
import PitchNavigation from "./PitchNavigation";
import BackgroundDoodles from "./BackgroundDoodles";
import "./landing-motion.css";

export default function Home() {
  return (
    <main id="top" className="pitchLanding">
      <header className="siteHeader">
        <a className="brand" href="#top" aria-label="Vaniyathans home">
          <Image
            className="brandLogo"
            src="/vaniyathans-logo-2026.png"
            alt="Vaniyathans Software Solutions"
            width={1984}
            height={793}
            preload
          />
        </a>

        <nav className="mainNav" aria-label="Main navigation">
          <a href="#expertise">Services</a>
          <a href="#method">Our process</a>
          <a href="#journey">User journey</a>
          <Link className="signInLink" href="/signin">Sign in</Link>
          <Link className="navCta" href="/signup/client">Sign up <span>↗</span></Link>
          <details className="mobileMenu">
            <summary aria-label="Open navigation menu">☰</summary>
            <nav aria-label="Mobile navigation">
              <a href="#expertise">Services</a>
              <a href="#method">Our process</a>
              <a href="#journey">User journey</a>
              <Link href="/signin">Sign in</Link>
            </nav>
          </details>
        </nav>
      </header>

      <PitchNavigation>
        <section className="lifecycle" id="method" data-pitch-section aria-labelledby="lifecycle-title">
          <BackgroundDoodles variant="process" />
          <div className="lifecycleHeader">
            <div className="lifecycleLabel">
              <span>02 / HOW WE WORK</span>
              <strong>5D</strong>
            </div>
            <h2 id="lifecycle-title">From idea<br /><em>to launch.</em></h2>
            <p>Our 5D process connects your vision to a working product, with clear priorities and visible progress.</p>
          </div>

          <ol className="lifecycleFlow">
            <li className="lifecycleStep">
              <div className="lifecycleVisual">
                <span>01</span>
                <div className="lifecycleIcon" aria-hidden="true">
                  <svg viewBox="0 0 120 120">
                    <circle className="iconHalo" cx="60" cy="60" r="38" />
                    <path className="iconFill" d="M60 28 68.5 48.5 89 57 68.5 65.5 60 86 51.5 65.5 31 57 51.5 48.5Z" />
                    <path d="M60 28 68.5 48.5 89 57 68.5 65.5 60 86 51.5 65.5 31 57 51.5 48.5Z" />
                    <path d="M91 25v12M85 31h12M28 82v9M23.5 86.5h9" />
                  </svg>
                </div>
              </div>
              <div className="lifecycleCopy"><h3>Dream</h3><p>Define the problem, your users, and what success looks like.</p></div>
            </li>

            <li className="lifecycleStep">
              <div className="lifecycleVisual">
                <span>02</span>
                <div className="lifecycleIcon" aria-hidden="true">
                  <svg viewBox="0 0 120 120">
                    <rect className="iconHalo" x="25" y="25" width="70" height="70" rx="16" />
                    <path d="M34 81C45 42 75 42 86 81" />
                    <circle cx="34" cy="81" r="4" />
                    <circle cx="60" cy="52" r="4" />
                    <circle cx="86" cy="81" r="4" />
                    <path d="M34 42h15M71 42h15M42 34v15M78 34v15" />
                  </svg>
                </div>
              </div>
              <div className="lifecycleCopy"><h3>Design</h3><p>Shape the experience and agree on a focused plan.</p></div>
            </li>

            <li className="lifecycleStep">
              <div className="lifecycleVisual">
                <span>03</span>
                <div className="lifecycleIcon" aria-hidden="true">
                  <svg viewBox="0 0 120 120">
                    <circle className="iconHalo" cx="60" cy="60" r="38" />
                    <path d="m43 39-21 21 21 21M77 39l21 21-21 21M69 27 51 93" />
                    <path d="M52 39h16M48 81h24" />
                  </svg>
                </div>
              </div>
              <div className="lifecycleCopy"><h3>Develop</h3><p>Build in small increments with regular reviews.</p></div>
            </li>

            <li className="lifecycleStep">
              <div className="lifecycleVisual">
                <span>04</span>
                <div className="lifecycleIcon" aria-hidden="true">
                  <svg viewBox="0 0 120 120">
                    <circle className="iconFill" cx="53" cy="53" r="31" />
                    <circle cx="53" cy="53" r="31" />
                    <path d="m76 76 24 24M30 55h13l7-14 9 25 7-11h11" />
                    <path d="M25 31v-8h8M73 23h8v8" />
                  </svg>
                </div>
              </div>
              <div className="lifecycleCopy"><h3>Diagnose</h3><p>Test the details and resolve issues before launch.</p></div>
            </li>

            <li className="lifecycleStep">
              <div className="lifecycleVisual">
                <span>05</span>
                <div className="lifecycleIcon" aria-hidden="true">
                  <svg viewBox="0 0 120 120">
                    <circle className="iconHalo" cx="60" cy="60" r="38" />
                    <path className="iconFill" d="M60 22 83 49 72 53v27H48V53L37 49Z" />
                    <path d="M60 92V24M38 49l22-25 22 25M47 78h26" />
                    <path d="M33 88c8 6 17 9 27 9s19-3 27-9" />
                  </svg>
                </div>
              </div>
              <div className="lifecycleCopy"><h3>Deploy</h3><p>Launch, learn from real use, and keep improving.</p></div>
            </li>
          </ol>
        </section>

        <section className="journey" id="journey" data-pitch-section aria-labelledby="journey-title">
          <BackgroundDoodles variant="discover" />
          <div className="journeyHeader">
            <div className="journeyLabel"><span>VSS / YOUR PRODUCT JOURNEY</span><strong>01–03 / DISCOVER</strong></div>
            <div><h2 id="journey-title">Your idea. <em>A clear plan.</em></h2><p>Start with your ambition, shape the possibilities, and put your users first.</p></div>
          </div>
          <ol className="journeyMap" start={1}>
            <li className="journeyCard" data-step="1">
              <div className="journeyCardTop"><span>01</span><div className="journeyOwner"><small>Client</small></div></div>
              <div className="journeyIllustration" aria-hidden="true" />
              <div><h3>Tell us your big idea</h3><p>Capture the problem, users, desired outcome, and constraints in one clear epic.</p></div>
            </li>
            <li className="journeyCard" data-step="2">
              <div className="journeyCardTop"><span>02</span><div className="journeyOwner"><small>Strategist</small></div></div>
              <div className="journeyIllustration" aria-hidden="true" />
              <div><h3>Shape the possibilities</h3><p>Shape the epic into independently valuable capabilities with clear boundaries.</p></div>
            </li>
            <li className="journeyCard" data-step="3">
              <div className="journeyCardTop"><span>03</span><div className="journeyOwner"><small>Product Owner</small></div></div>
              <div className="journeyIllustration" aria-hidden="true" />
              <div><h3>Put your users first</h3><p>Frame each feature from the user&apos;s point of view with testable acceptance criteria.</p></div>
            </li>
          </ol>
        </section>

        <section className="journey" id="journey-plan" data-pitch-section aria-labelledby="journey-plan-title">
          <BackgroundDoodles variant="shape" />
          <div className="journeyHeader">
            <div className="journeyLabel"><span>VSS / YOUR PRODUCT JOURNEY</span><strong>04–06 / SHAPE</strong></div>
            <div><h2 id="journey-plan-title">A shared plan. <em>Made tangible.</em></h2><p>Give every task an owner, prioritize the work, and bring the experience to life.</p></div>
          </div>
          <ol className="journeyMap" start={4}>
            <li className="journeyCard" data-step="4">
              <div className="journeyCardTop"><span>04</span><div className="journeyOwner"><small>Tech Lead</small></div></div>
              <div className="journeyIllustration" aria-hidden="true" />
              <div><h3>Give every task an owner</h3><p>Translate each story into executable work with dependencies and ownership made explicit.</p></div>
            </li>
            <li className="journeyCard" data-step="5">
              <div className="journeyCardTop"><span>05</span><div className="journeyOwner"><small>Delivery Lead</small></div></div>
              <div className="journeyIllustration" aria-hidden="true" />
              <div><h3>Make the right moves first</h3><p>Sequence work by value, urgency, risk, effort, and technical dependency.</p></div>
            </li>
            <li className="journeyCard" data-step="6">
              <div className="journeyCardTop"><span>06</span><div className="journeyOwner"><small>Designer</small></div></div>
              <div className="journeyIllustration" aria-hidden="true" />
              <div><h3>Bring the experience to life</h3><p>Create the flows, interfaces, and system decisions that make the experience feel inevitable.</p></div>
            </li>
          </ol>
        </section>

        <section className="journey" id="journey-launch" data-pitch-section aria-labelledby="journey-launch-title">
          <BackgroundDoodles variant="launch" />
          <div className="journeyHeader">
            <div className="journeyLabel"><span>VSS / YOUR PRODUCT JOURNEY</span><strong>07–09 / DELIVER</strong></div>
            <div><h2 id="journey-launch-title">Build with care. <em>Launch with confidence.</em></h2><p>Engineer, test, and release your product. Then learn from the people who use it.</p></div>
          </div>
          <ol className="journeyMap" start={7}>
            <li className="journeyCard" data-step="7">
              <div className="journeyCardTop"><span>07</span><div className="journeyOwner"><small>Engineer</small></div></div>
              <div className="journeyIllustration" aria-hidden="true" />
              <div><h3>Build it, together</h3><p>Build in focused increments with continuous integration, review, and visible progress.</p></div>
            </li>
            <li className="journeyCard" data-step="8">
              <div className="journeyCardTop"><span>08</span><div className="journeyOwner"><small>Quality Engineer</small></div></div>
              <div className="journeyIllustration" aria-hidden="true" />
              <div><h3>Make every detail work</h3><p>Test behavior, performance, and resilience; resolve defects before they slow users down.</p></div>
            </li>
            <li className="journeyCard" data-step="9">
              <div className="journeyCardTop"><span>09</span><div className="journeyOwner"><small>Release Engineer</small></div></div>
              <div className="journeyIllustration" aria-hidden="true" />
              <div><h3>Launch. Learn. Grow.</h3><p>Release safely, observe real outcomes, and carry every learning into the next epic.</p></div>
            </li>
          </ol>
          <div className="journeyLoop"><span>RELEASE INSIGHT</span><i aria-hidden="true">↺</i><strong>FEEDS THE NEXT EPIC</strong></div>
        </section>

        <section className="contact" id="contact" data-pitch-section aria-labelledby="contact-title">
          <BackgroundDoodles variant="contact" />
          <div className="contactTop">
            <span>04 / LET’S BUILD TOGETHER</span>
            <span>THIRUVANANTHAPURAM · KERALA</span>
          </div>
          <div className="contactMain">
            <div>
              <p>Your idea. Our next conversation.</p>
              <h2 id="contact-title">What would you<br />like to build?</h2>
              <p className="contactSummary">Share your idea, your priorities, and where you want to go.</p>
              <Link className="primaryButton contactProject" href="/signup/client">Start a project <span aria-hidden="true">↗</span></Link>
            </div>
            <div className="contactActions">
              <a
                className="contactButton"
                href="https://wa.me/919074577932?text=Hello%20Vaniyathans%20Software%20Solutions%2C%20I%27d%20like%20to%20discuss%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Message Vaniyathans Software Solutions on WhatsApp"
              >
                <span>Message us on<br />WhatsApp</span>
                <b aria-hidden="true">
                  <svg className="whatsappIcon" viewBox="0 0 24 24" fill="none" focusable="false">
                    <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.3-4.8A8.5 8.5 0 1 1 20.5 11.7Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                    <path d="M8.1 7.1c-.3 0-.6.1-.8.4-.3.3-.8.8-.8 1.9s.8 2.2.9 2.4c.1.1 1.6 2.5 4 3.5 2 .8 2.4.6 2.9.5.4 0 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.5-.3-1.6-.8c-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1-.3-.1-1-.4-1.9-1.2-.7-.6-1.1-1.3-1.3-1.6-.1-.2 0-.3.1-.4l.6-.8c.1-.2.1-.3 0-.5L8.8 7.4c-.1-.3-.3-.3-.5-.3h-.2Z" fill="currentColor" />
                  </svg>
                </b>
              </a>
              <a className="contactMail" href="mailto:mail@vaniyathans.com">
                <span>Prefer email?</span>
                <strong>mail@vaniyathans.com ↗</strong>
              </a>
            </div>
          </div>
          <footer className="contactFooter">
            <span>© 2026 Vaniyathans Software Solutions Pvt. Ltd.</span>
            <nav aria-label="More ways to connect"><Link href="/signup/workforce">Join our workforce ↗</Link><Link href="/signin">Sign in ↗</Link></nav>
          </footer>
        </section>
      </PitchNavigation>
    </main>
  );
}
