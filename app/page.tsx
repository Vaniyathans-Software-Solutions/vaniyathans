import Link from "next/link";

export default function Home() {
  return (
    <main id="top">
      <header className="siteHeader">
        <a className="brand" href="#top" aria-label="Vaniyathans home">
          <span className="brandWordmark">VANIYATHANS</span>
        </a>

        <nav className="mainNav" aria-label="Main navigation">
          <a href="#expertise">Expertise</a>
          <a href="#method">Method</a>
          <Link className="navCta" href="/signup">Start a project <span>↗</span></Link>
        </nav>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="heroGrid" aria-hidden="true" />
        <div className="globeStage" aria-hidden="true">
          <div className="globeGlow" />
          <svg className="buildGlobe" viewBox="0 0 620 620">
            <defs>
              <radialGradient id="globe-surface" cx="36%" cy="28%" r="72%">
                <stop offset="0%" stopColor="#8a5cff" stopOpacity=".2" />
                <stop offset="58%" stopColor="#183b72" stopOpacity=".12" />
                <stop offset="100%" stopColor="#061725" stopOpacity=".04" />
              </radialGradient>
              <clipPath id="globe-clip"><circle cx="310" cy="286" r="218" /></clipPath>
              <filter id="node-glow" x="-200%" y="-200%" width="400%" height="400%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            <circle className="globeOuterRing" cx="310" cy="286" r="246" />
            <circle className="globeSurface" cx="310" cy="286" r="218" />

            <g className="globeGrid" clipPath="url(#globe-clip)">
              <ellipse cx="310" cy="286" rx="92" ry="218" />
              <ellipse cx="310" cy="286" rx="164" ry="218" />
              <ellipse cx="310" cy="286" rx="218" ry="74" />
              <ellipse cx="310" cy="286" rx="218" ry="148" />
              <path d="M92 286h436" />
              <path d="M310 68v436" />
            </g>

            <g className="globeRoutes" clipPath="url(#globe-clip)">
              <path className="globeRoute routeCyan" d="M127 226C216 132 392 143 501 243" />
              <path className="globeRoute routeMint" d="M111 328C232 426 408 411 519 292" />
              <path className="globeRoute routeCoral" d="M218 89C181 236 267 420 423 482" />
              <path className="globeRoute routeGold" d="M464 125C376 226 390 371 483 431" />
            </g>

            <g className="globeNodes" filter="url(#node-glow)">
              <circle className="globeNode nodeCyan" cx="155" cy="203" r="6" />
              <circle className="globeNode nodeMint" cx="258" cy="169" r="6" />
              <circle className="globeNode nodeCoral" cx="390" cy="181" r="6" />
              <circle className="globeNode nodeGold" cx="481" cy="230" r="6" />
              <circle className="globeNode nodeMint" cx="132" cy="343" r="6" />
              <circle className="globeNode nodeCyan" cx="265" cy="397" r="6" />
              <circle className="globeNode nodeGold" cx="410" cy="386" r="6" />
              <circle className="globeNode nodeCoral" cx="501" cy="315" r="6" />
              <circle className="globeNode nodeGold" cx="212" cy="111" r="6" />
              <circle className="globeNode nodeCyan" cx="407" cy="468" r="6" />
              <circle className="globeNode nodeCoral" cx="457" cy="145" r="6" />
              <circle className="globeNode nodeMint" cx="477" cy="414" r="6" />
            </g>

            <g className="routeTraveler travelerCyan">
              <path d="M-8-5 8 0-8 5Z" />
              <animateMotion dur="5.5s" repeatCount="indefinite" rotate="auto" path="M127 226C216 132 392 143 501 243" />
            </g>
            <g className="routeTraveler travelerMint">
              <path d="M-8-5 8 0-8 5Z" />
              <animateMotion begin="-2s" dur="6.4s" repeatCount="indefinite" rotate="auto" path="M111 328C232 426 408 411 519 292" />
            </g>
            <g className="routeTraveler travelerCoral">
              <path d="M-8-5 8 0-8 5Z" />
              <animateMotion begin="-3.5s" dur="7.2s" repeatCount="indefinite" rotate="auto" path="M218 89C181 236 267 420 423 482" />
            </g>
            <g className="routeTraveler travelerGold">
              <path d="M-8-5 8 0-8 5Z" />
              <animateMotion begin="-1s" dur="5.8s" repeatCount="indefinite" rotate="auto" path="M464 125C376 226 390 371 483 431" />
            </g>
          </svg>

          <span className="globeZone zoneAmericas">UTC−08 <i>↘</i></span>
          <span className="globeZone zoneEurope">UTC+01 <i>↘</i></span>
          <span className="globeZone zoneAsia">UTC+05:30 <i>↘</i></span>
          <div className="globeStatus">
            <span />
            <div><strong>24/7 BUILD NETWORK</strong><small>ENGINEERS ACROSS TIME ZONES</small></div>
          </div>
        </div>

        <div className="heroCopy">
          <p className="eyebrow"><span /> 8-hour delivery · 24/7 workforce</p>
          <h1 id="hero-title">
            BUILD YOUR DREAM SOFTWARE<br /><em>IN MINUTES</em>
          </h1>
          <div className="heroBottom">
            <p>The world&apos;s first software company built to deliver software within 8 hours, powered by a 24/7 workforce.</p>
            <a className="primaryButton" href="#expertise">Explore our work <span aria-hidden="true">↘</span></a>
          </div>
        </div>

        <div className="heroRail" aria-hidden="true">
          <span>PRODUCT × ENGINEERING × INTELLIGENCE</span>
          <span>© 2026</span>
        </div>
      </section>

      <section className="lifecycle" aria-labelledby="lifecycle-title">
        <div className="lifecycleHeader">
          <div className="lifecycleLabel">
            <span>VSS / PRODUCT SYSTEM</span>
            <strong>5D</strong>
          </div>
          <h2 id="lifecycle-title">The 5D<br /><em>Product Life Cycle</em></h2>
          <p>Five connected disciplines take your product from its first spark to a confident release.</p>
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
            <div className="lifecycleCopy"><h3>Dream</h3><p>Find the ambition, the people, and the outcome worth building for.</p></div>
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
            <div className="lifecycleCopy"><h3>Design</h3><p>Shape the experience, system, and blueprint before complexity grows.</p></div>
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
            <div className="lifecycleCopy"><h3>Develop</h3><p>Engineer the product in focused, testable, production-ready increments.</p></div>
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
            <div className="lifecycleCopy"><h3>Diagnose</h3><p>Test, measure, and resolve friction before it reaches your users.</p></div>
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
            <div className="lifecycleCopy"><h3>Deploy</h3><p>Release with confidence, observe the outcome, and keep evolving.</p></div>
          </li>
        </ol>
      </section>

      <section className="journey" id="journey" aria-labelledby="journey-title">
        <div className="journeyHeader">
          <div className="journeyLabel"><span>VSS / DELIVERY MAP</span><strong>09 MOVES</strong></div>
          <div>
            <h2 id="journey-title">User Journey <em>Map.</em></h2>
            <p>One visible path from your first requirement to a dependable product in production.</p>
          </div>
        </div>

        <ol className="journeyMap">
          <li className="journeyCard">
            <div className="journeyCardTop"><span>01</span><div className="journeyOwner"><span className="journeyAvatar" aria-hidden="true" /><small>Client</small></div></div>
            <div className="journeyIllustration" aria-hidden="true"><svg viewBox="0 0 120 90"><rect x="30" y="12" width="60" height="68" rx="7" /><path d="M43 31h34M43 44h34M43 57h23" /><path className="journeyAccent" d="M76 68h20V48" /><path d="m88 56 8-8 8 8" /></svg></div>
            <div><h3>Write requirements as an Epic</h3><p>Capture the problem, users, desired outcome, and constraints in one clear epic.</p></div>
          </li>

          <li className="journeyCard">
            <div className="journeyCardTop"><span>02</span><div className="journeyOwner"><span className="journeyAvatar" aria-hidden="true" /><small>Strategist</small></div></div>
            <div className="journeyIllustration" aria-hidden="true"><svg viewBox="0 0 120 90"><rect x="44" y="10" width="32" height="22" rx="5" /><rect x="12" y="58" width="26" height="20" rx="5" /><rect x="47" y="58" width="26" height="20" rx="5" /><rect x="82" y="58" width="26" height="20" rx="5" /><path d="M60 32v13M25 45h70M25 45v13M60 45v13M95 45v13" /></svg></div>
            <div><h3>Break the Epic into Features</h3><p>Shape the epic into independently valuable capabilities with clear boundaries.</p></div>
          </li>

          <li className="journeyCard">
            <div className="journeyCardTop"><span>03</span><div className="journeyOwner"><span className="journeyAvatar" aria-hidden="true" /><small>Product Owner</small></div></div>
            <div className="journeyIllustration" aria-hidden="true"><svg viewBox="0 0 120 90"><path d="M15 16h60a8 8 0 0 1 8 8v24a8 8 0 0 1-8 8H42L27 68V56H15a8 8 0 0 1-8-8V24a8 8 0 0 1 8-8Z" /><path className="journeyAccent" d="M58 42h43a8 8 0 0 1 8 8v18a8 8 0 0 1-8 8H89v8L78 76H58a8 8 0 0 1-8-8V56" /><path d="M22 31h45M22 41h31" /></svg></div>
            <div><h3>Turn Features into User Stories</h3><p>Frame each feature from the user&apos;s point of view with testable acceptance criteria.</p></div>
          </li>

          <li className="journeyCard">
            <div className="journeyCardTop"><span>04</span><div className="journeyOwner"><span className="journeyAvatar" aria-hidden="true" /><small>Tech Lead</small></div></div>
            <div className="journeyIllustration" aria-hidden="true"><svg viewBox="0 0 120 90"><circle cx="18" cy="20" r="7" /><circle cx="51" cy="49" r="7" /><circle cx="91" cy="49" r="7" /><circle cx="70" cy="78" r="6" /><circle cx="108" cy="78" r="6" /><path d="M25 20h26v22M58 49h26M91 56v15M91 71H70v1M91 71h17v1" /><path className="journeyAccent" d="m12 20 4 4 8-10M45 49l4 4 8-10" /></svg></div>
            <div><h3>Split Stories into Tasks &amp; Subtasks</h3><p>Translate each story into executable work with dependencies and ownership made explicit.</p></div>
          </li>

          <li className="journeyCard">
            <div className="journeyCardTop"><span>05</span><div className="journeyOwner"><span className="journeyAvatar" aria-hidden="true" /><small>Delivery Lead</small></div></div>
            <div className="journeyIllustration" aria-hidden="true"><svg viewBox="0 0 120 90"><rect x="14" y="14" width="74" height="15" rx="5" /><rect x="14" y="38" width="58" height="15" rx="5" /><rect x="14" y="62" width="42" height="15" rx="5" /><path className="journeyAccent" d="M101 74V18M90 29l11-11 11 11" /></svg></div>
            <div><h3>Prioritize the Backlog</h3><p>Sequence work by value, urgency, risk, effort, and technical dependency.</p></div>
          </li>

          <li className="journeyCard">
            <div className="journeyCardTop"><span>06</span><div className="journeyOwner"><span className="journeyAvatar" aria-hidden="true" /><small>Designer</small></div></div>
            <div className="journeyIllustration" aria-hidden="true"><svg viewBox="0 0 120 90"><rect x="14" y="12" width="92" height="66" rx="9" /><path d="M14 29h92M29 20h1M39 20h1M49 20h1" /><path className="journeyAccent" d="M31 63c10-28 32-28 42 0M31 63h42" /><circle cx="31" cy="63" r="4" /><circle cx="52" cy="43" r="4" /><circle cx="73" cy="63" r="4" /></svg></div>
            <div><h3>Design</h3><p>Create the flows, interfaces, and system decisions that make the experience feel inevitable.</p></div>
          </li>

          <li className="journeyCard">
            <div className="journeyCardTop"><span>07</span><div className="journeyOwner"><span className="journeyAvatar" aria-hidden="true" /><small>Engineer</small></div></div>
            <div className="journeyIllustration" aria-hidden="true"><svg viewBox="0 0 120 90"><rect x="10" y="10" width="100" height="70" rx="9" /><path d="M10 28h100M25 19h1M35 19h1" /><path className="journeyAccent" d="m48 42-16 12 16 12M72 42l16 12-16 12M66 36 54 72" /></svg></div>
            <div><h3>Development</h3><p>Build in focused increments with continuous integration, review, and visible progress.</p></div>
          </li>

          <li className="journeyCard">
            <div className="journeyCardTop"><span>08</span><div className="journeyOwner"><span className="journeyAvatar" aria-hidden="true" /><small>Quality Engineer</small></div></div>
            <div className="journeyIllustration" aria-hidden="true"><svg viewBox="0 0 120 90"><circle cx="49" cy="42" r="29" /><path d="m70 63 27 20M26 44h13l7-14 9 25 7-11h13" /><path className="journeyAccent" d="M89 17v17M80.5 25.5h17" /></svg></div>
            <div><h3>Diagnose</h3><p>Test behavior, performance, and resilience; resolve defects before they slow users down.</p></div>
          </li>

          <li className="journeyCard">
            <div className="journeyCardTop"><span>09</span><div className="journeyOwner"><span className="journeyAvatar" aria-hidden="true" /><small>Release Engineer</small></div></div>
            <div className="journeyIllustration" aria-hidden="true"><svg viewBox="0 0 120 90"><path className="journeyAccent" d="M60 74V16M38 38l22-22 22 22" /><path d="M23 61v17h74V61M32 52h56" /><path d="M20 45c-7-5-7-15 1-19 1-13 16-19 26-11M100 45c7-5 7-15-1-19-1-13-16-19-26-11" /></svg></div>
            <div><h3>Deploy</h3><p>Release safely, observe real outcomes, and carry every learning into the next epic.</p></div>
          </li>
        </ol>

        <div className="journeyLoop"><span>RELEASE INSIGHT</span><i aria-hidden="true">↺</i><strong>FEEDS THE NEXT EPIC</strong></div>
      </section>

      <section className="uspBar" aria-labelledby="usp-title">
        <div className="uspLabel"><span>VSS / USP</span><i /></div>
        <div className="uspPromise">
          <span className="uspMetric">08<small>HRS</small></span>
          <h2 id="usp-title">Engineering digital<br /><em>momentum.</em></h2>
        </div>
        <p><strong>World&apos;s first.</strong> Our 24/7 workforce keeps every project moving around the clock.</p>
      </section>

      <div className="ticker" aria-hidden="true">
        <div className="tickerTrack">
          <span>8-HOUR DELIVERY</span><i>✦</i><span>24/7 WORKFORCE</span><i>✦</i><span>PRODUCT STRATEGY</span><i>✦</i><span>EXPERIENCE DESIGN</span><i>✦</i><span>SOFTWARE ENGINEERING</span><i>✦</i>
          <span>8-HOUR DELIVERY</span><i>✦</i><span>24/7 WORKFORCE</span><i>✦</i><span>PRODUCT STRATEGY</span><i>✦</i><span>EXPERIENCE DESIGN</span><i>✦</i><span>SOFTWARE ENGINEERING</span><i>✦</i>
        </div>
      </div>

      <section className="manifesto sectionLight" aria-labelledby="manifesto-title">
        <div className="sectionKicker"><span>01</span><span>What drives us</span></div>
        <div className="manifestoCopy">
          <h2 id="manifesto-title">Technology should<br />move your business<br /><em>forward.</em></h2>
          <div className="manifestoNote">
            <p>Vaniyathans Software Solutions is a product and engineering partner for organizations ready to turn bold ideas into dependable digital systems.</p>
            <span className="finePrint">THINK CLEARLY · BUILD PRECISELY · SCALE CONFIDENTLY</span>
          </div>
        </div>
        <div className="manifestoMark" aria-hidden="true">V</div>
      </section>

      <section className="expertise" id="expertise" aria-labelledby="expertise-title">
        <div className="sectionHeading">
          <div className="sectionKicker sectionKickerDark"><span>02</span><span>Capabilities</span></div>
          <h2 id="expertise-title">Built from idea<br />to <em>impact.</em></h2>
          <p>One focused team across strategy, experience, engineering, and intelligent automation.</p>
        </div>

        <div className="serviceList">
          <article className="serviceRow">
            <span className="serviceNumber">01</span>
            <div><h3>Digital Product<br />Engineering</h3><p>Web platforms, mobile experiences, and business-critical software designed for speed, clarity, and scale.</p></div>
            <ul aria-label="Digital product engineering services"><li>Web & mobile</li><li>Platform architecture</li><li>Product modernization</li></ul>
            <span className="serviceArrow" aria-hidden="true">↗</span>
          </article>
          <article className="serviceRow">
            <span className="serviceNumber">02</span>
            <div><h3>AI & Intelligent<br />Automation</h3><p>Purpose-built AI systems that streamline work, surface insight, and create practical advantages.</p></div>
            <ul aria-label="AI and automation services"><li>AI integrations</li><li>Workflow automation</li><li>Data intelligence</li></ul>
            <span className="serviceArrow" aria-hidden="true">↗</span>
          </article>
          <article className="serviceRow">
            <span className="serviceNumber">03</span>
            <div><h3>Cloud & Technology<br />Advisory</h3><p>Resilient foundations and pragmatic technical direction for products that need to evolve without friction.</p></div>
            <ul aria-label="Cloud and advisory services"><li>Cloud-native systems</li><li>Technical strategy</li><li>DevOps & reliability</li></ul>
            <span className="serviceArrow" aria-hidden="true">↗</span>
          </article>
        </div>
      </section>

      <section className="outcomes sectionLight" aria-labelledby="outcomes-title">
        <div className="sectionKicker"><span>03</span><span>What we unlock</span></div>
        <div className="outcomeHeader">
          <h2 id="outcomes-title">From complexity<br />to <em>clarity.</em></h2>
          <p>We focus on the outcomes behind the software: better experiences, leaner operations, and room to grow.</p>
        </div>
        <div className="outcomeGrid">
          <article className="outcomeCard outcomeCardDark">
            <div className="cardTop"><span>01 / PRODUCT</span><span>↗</span></div>
            <div className="productVisual" aria-hidden="true"><span /><span /><span /></div>
            <div><h3>Digital products people want to use.</h3><p>Focused journeys. Thoughtful interfaces. Reliable engineering.</p></div>
          </article>
          <article className="outcomeCard outcomeCardSignal">
            <div className="cardTop"><span>02 / OPERATIONS</span><span>↗</span></div>
            <div className="dataVisual" aria-hidden="true">
              <span>08:42</span><div><i style={{ height: "38%" }} /><i style={{ height: "61%" }} /><i style={{ height: "47%" }} /><i style={{ height: "84%" }} /><i style={{ height: "72%" }} /></div>
            </div>
            <div><h3>Smarter operations, less friction.</h3><p>Connected workflows that turn repeated effort into durable leverage.</p></div>
          </article>
          <article className="outcomeCard outcomeCardPaper">
            <div className="cardTop"><span>03 / SCALE</span><span>↗</span></div>
            <div className="scaleVisual" aria-hidden="true"><span>VSS</span><i /><i /><i /></div>
            <div><h3>Foundations made for what comes next.</h3><p>Adaptable platforms that grow with the ambition behind them.</p></div>
          </article>
        </div>
      </section>

      <section className="method" id="method" aria-labelledby="method-title">
        <div className="methodIntro">
          <div className="sectionKicker sectionKickerDark"><span>04</span><span>How we work</span></div>
          <h2 id="method-title">Sharp thinking.<br />Steady <em>delivery.</em></h2>
          <p>A transparent, collaborative process that keeps teams aligned and momentum visible.</p>
        </div>
        <ol className="methodSteps">
          <li><span>01</span><div><h3>Discover</h3><p>We align on the business problem, the people it affects, and the outcome that matters.</p></div></li>
          <li><span>02</span><div><h3>Define</h3><p>We shape the product, technical direction, and focused roadmap before complexity grows.</p></div></li>
          <li><span>03</span><div><h3>Deliver</h3><p>We design and engineer in close, testable increments with quality built into every release.</p></div></li>
          <li><span>04</span><div><h3>Evolve</h3><p>We measure, learn, and strengthen the platform as your users and ambitions expand.</p></div></li>
        </ol>
      </section>

      <section className="belief" aria-label="Our belief">
        <p>Our belief</p>
        <h2>Software should create<br /><em>leverage.</em> Not noise.</h2>
        <div className="beliefOrb" aria-hidden="true"><span>VSS</span></div>
      </section>

      <section className="contact" id="contact" aria-labelledby="contact-title">
        <div className="contactTop">
          <span>HAVE A PROJECT IN MIND?</span>
          <span>THIRUVANANTHAPURAM · KERALA</span>
        </div>
        <div className="contactMain">
          <div>
            <p>Let&apos;s build the next move.</p>
            <h2 id="contact-title">Start a<br />conversation.</h2>
          </div>
          <div className="contactActions">
            <a
              className="contactButton"
              href="https://wa.me/919074577932?text=Hello%20Vaniyathans%20Software%20Solutions%2C%20I%27d%20like%20to%20discuss%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Message Vaniyathans Software Solutions on WhatsApp"
            >
              <span>Message us on<br />WhatsApp</span><b aria-hidden="true">↗</b>
            </a>
            <a className="contactMail" href="mailto:mail@vaniyathans.com">
              <span>Prefer email?</span>
              <strong>mail@vaniyathans.com ↗</strong>
            </a>
          </div>
        </div>
      </section>

      <footer className="siteFooter">
        <a className="footerBrand" href="#top" aria-label="Back to top"><span>VSS</span><small>VANIYATHANS SOFTWARE SOLUTIONS PVT. LTD.</small></a>
        <p>Strategy · Design · Engineering · Intelligence</p>
        <div className="footerContacts">
          <a href="mailto:mail@vaniyathans.com">mail@vaniyathans.com</a>
          <a href="https://wa.me/919074577932" target="_blank" rel="noopener noreferrer">WhatsApp +91 90745 77932</a>
        </div>
        <div className="footerMeta"><span>© 2026 VSS</span><a href="#top">Back to top ↑</a></div>
      </footer>
    </main>
  );
}
