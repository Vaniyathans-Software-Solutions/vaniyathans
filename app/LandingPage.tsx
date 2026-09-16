import ArrowIcon from "@/app/ArrowIcon";
import { type Locale } from "./i18n/shared";
import { getTranslator } from "./i18n/dictionaries.server";
import Link from "@/app/i18n/LocalizedLink";
import PitchNavigation from "./PitchNavigation";
import BackgroundDoodles from "./BackgroundDoodles";
import ProductJourney from "./ProductJourney";
import ProductJourneyGame from "./ProductJourneyGame";
import "./landing-motion.css";

export default async function LandingPage({ locale = "en" }: { locale?: Locale }) {
  const t = await getTranslator(locale);
  return (
    <main id="top" className="pitchLanding">
      <PitchNavigation>
        <section className="lifecycle" id="method" data-pitch-section aria-labelledby="lifecycle-title">
          <BackgroundDoodles variant="process" />
          <div className="lifecycleHeader">
            <div className="lifecycleLabel">
              <span>{t("02 / HOW WE WORK")}</span>
              <strong>{t("5D")}</strong>
            </div>
            <h2 id="lifecycle-title">{t("From idea")}<br /><em>{t("to launch.")}</em></h2>
            <p>{t("Our 5D process connects your vision to a working product, with clear priorities and visible progress.")}</p>
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
              <div className="lifecycleCopy"><h3>{t("Dream")}</h3><p>{t("Define the problem, your users, and what success looks like.")}</p></div>
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
              <div className="lifecycleCopy"><h3>{t("Design")}</h3><p>{t("Shape the experience and agree on a focused plan.")}</p></div>
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
              <div className="lifecycleCopy"><h3>{t("Develop")}</h3><p>{t("Build in small increments with regular reviews.")}</p></div>
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
              <div className="lifecycleCopy"><h3>{t("Diagnose")}</h3><p>{t("Test the details and resolve issues before launch.")}</p></div>
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
              <div className="lifecycleCopy"><h3>{t("Deploy")}</h3><p>{t("Launch, learn from real use, and keep improving.")}</p></div>
            </li>
          </ol>
        </section>

        <ProductJourney t={t} />
        <ProductJourneyGame />

        <section className="contact" id="contact" data-pitch-section aria-labelledby="contact-title">
          <BackgroundDoodles variant="contact" />
          <div className="contactTop">
            <span>{t("04 / LET’S BUILD TOGETHER")}</span>
            <span>{t("THIRUVANANTHAPURAM · KERALA")}</span>
          </div>
          <div className="contactMain">
            <div>
              <p>{t("Your idea. Our next conversation.")}</p>
              <h2 id="contact-title">{t("What would you")}<br />{t("like to build?")}</h2>
              <p className="contactSummary">{t("Share your idea, your priorities, and where you want to go.")}</p>
              <Link className="primaryButton contactProject" href="/signup/client">{t("Start a project")} <ArrowIcon direction="up-right" /></Link>
            </div>
            <div className="contactActions">
              <a
                className="contactButton"
                href="https://wa.me/919074577932?text=Hello%20Vaniyathans%20Software%20Solutions%2C%20I%27d%20like%20to%20discuss%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("Message Vaniyathans Software Solutions on WhatsApp")}
              >
                <span data-chat-label={t("LIVE · CLICK TO CHAT")}>{t("Message us on")}<br />{t("WhatsApp")}</span>
                <b aria-hidden="true">
                  <svg className="whatsappIcon" viewBox="0 0 24 24" fill="none" focusable="false">
                    <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.3-4.8A8.5 8.5 0 1 1 20.5 11.7Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                    <path d="M8.1 7.1c-.3 0-.6.1-.8.4-.3.3-.8.8-.8 1.9s.8 2.2.9 2.4c.1.1 1.6 2.5 4 3.5 2 .8 2.4.6 2.9.5.4 0 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.5-.3-1.6-.8c-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1-.3-.1-1-.4-1.9-1.2-.7-.6-1.1-1.3-1.3-1.6-.1-.2 0-.3.1-.4l.6-.8c.1-.2.1-.3 0-.5L8.8 7.4c-.1-.3-.3-.3-.5-.3h-.2Z" fill="currentColor" />
                  </svg>
                </b>
              </a>
              <a className="contactMail" href="mailto:mail@vaniyathans.com">
                <span>{t("Prefer email?")}</span>
                <strong>mail@vaniyathans.com <ArrowIcon direction="up-right" /></strong>
              </a>
            </div>
          </div>
          <footer className="contactFooter">
            <span>{t("© 2026 Vaniyathans Software Solutions Pvt. Ltd.")}</span>
            <nav aria-label={t("More ways to connect")}><Link href="/signup/workforce">{t("Join our workforce")} <ArrowIcon direction="up-right" /></Link><Link href="/signin">{t("Sign in")} <ArrowIcon direction="up-right" /></Link></nav>
          </footer>
        </section>
      </PitchNavigation>
    </main>
  );
}
