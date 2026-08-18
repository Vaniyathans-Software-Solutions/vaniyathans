import Image from "next/image";

export default function Home() {
  return (
    <main id="top">
      <header className="siteHeader">
        <a className="brand" href="#top" aria-label="Vaniyathans home">
          <span className="brandMark" aria-hidden="true">
            <Image src="/vss-logo.png" alt="" width={1890} height={1890} priority />
          </span>
          <span className="brandName">VANIYATHANS</span>
        </a>

        <nav className="mainNav" aria-label="Main navigation">
          <a href="#expertise">Expertise</a>
          <a href="#method">Method</a>
          <a className="navCta" href="#contact">Start a project <span>↗</span></a>
        </nav>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="heroGrid" aria-hidden="true" />
        <div className="orbitStage" aria-hidden="true">
          <span className="orbit orbitOne" />
          <span className="orbit orbitTwo" />
          <span className="orbit orbitThree" />
          <span className="orbitCore">VSS</span>
        </div>

        <div className="heroCopy">
          <p className="eyebrow"><span /> Independent software studio · India / Global</p>
          <h1 id="hero-title">
            Engineering<br />digital <em>momentum.</em>
          </h1>
          <div className="heroBottom">
            <p>We design and build high-performance digital products for ambitious businesses ready to move forward.</p>
            <a className="primaryButton" href="#expertise">Explore our work <span aria-hidden="true">↘</span></a>
          </div>
        </div>

        <div className="heroRail" aria-hidden="true">
          <span>PRODUCT × ENGINEERING × INTELLIGENCE</span>
          <span>© 2026</span>
        </div>
      </section>

      <div className="ticker" aria-hidden="true">
        <div className="tickerTrack">
          <span>PRODUCT STRATEGY</span><i>✦</i><span>EXPERIENCE DESIGN</span><i>✦</i><span>SOFTWARE ENGINEERING</span><i>✦</i><span>AI SYSTEMS</span><i>✦</i><span>CLOUD PLATFORMS</span><i>✦</i>
          <span>PRODUCT STRATEGY</span><i>✦</i><span>EXPERIENCE DESIGN</span><i>✦</i><span>SOFTWARE ENGINEERING</span><i>✦</i><span>AI SYSTEMS</span><i>✦</i><span>CLOUD PLATFORMS</span><i>✦</i>
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
          <a className="contactButton" href="mailto:richardson@binschool.com" aria-label="Email Vaniyathans Software Solutions">
            <span>Tell us about<br />your project</span><b aria-hidden="true">↗</b>
          </a>
        </div>
      </section>

      <footer className="siteFooter">
        <a className="footerBrand" href="#top" aria-label="Back to top"><span>VSS</span><small>VANIYATHANS SOFTWARE SOLUTIONS PVT. LTD.</small></a>
        <p>Strategy · Design · Engineering · Intelligence</p>
        <div><span>© 2026 VSS</span><a href="#top">Back to top ↑</a></div>
      </footer>
    </main>
  );
}
