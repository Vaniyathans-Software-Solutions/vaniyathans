import ArrowIcon from "@/app/ArrowIcon";
import { type Locale } from "./i18n/shared";
import { getTranslator } from "./i18n/dictionaries.server";
import Link from "@/app/i18n/LocalizedLink";
import PitchNavigation from "./PitchNavigation";
import BackgroundDoodles from "./BackgroundDoodles";
import ProductJourney from "./ProductJourney";
import ProductJourneyGame from "./ProductJourneyGame";
import JourneyProvider from "./JourneyProvider";
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
            <h2 id="lifecycle-title">{t("Built together,")}<br /><em>{t("shared openly.")}</em></h2>
            <p>{t("Our 5D process turns shared needs into open source software: discover a real problem, build in the open, and keep improving with the people who use it.")}</p>
          </div>

          <ol className="lifecycleFlow">
            <li className="lifecycleStep">
              <div className="lifecycleVisual">
                <span>01</span>
                <div className="lifecycleIcon" aria-hidden="true">
                  <svg viewBox="0 0 120 120">
                    <circle className="iconHalo" cx="60" cy="60" r="38" />
                    <circle className="iconFill" cx="60" cy="43" r="11" />
                    <circle cx="33" cy="54" r="8" /><circle cx="87" cy="54" r="8" />
                    <path d="M42 86v-9a18 18 0 0 1 36 0v9M20 86v-6a13 13 0 0 1 17-12M100 86v-6a13 13 0 0 0-17-12" />
                  </svg>
                </div>
              </div>
              <div className="lifecycleCopy"><h3>{t("Dream")}</h3><p>{t("Listen to people and find a problem worth solving together.")}</p></div>
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
              <div className="lifecycleCopy"><h3>{t("Design")}</h3><p>{t("Design accessible experiences and share the thinking behind them.")}</p></div>
            </li>

            <li className="lifecycleStep">
              <div className="lifecycleVisual">
                <span>03</span>
                <div className="lifecycleIcon" aria-hidden="true">
                  <svg viewBox="0 0 120 120">
                    <circle className="iconHalo" cx="60" cy="60" r="38" />
                    <circle cx="39" cy="33" r="7" /><circle cx="81" cy="33" r="7" /><circle className="iconFill" cx="60" cy="88" r="8" />
                    <path d="M39 40v15c0 16 21 8 21 25M81 40v15c0 16-21 8-21 25M51 60l9 9 9-9" />
                  </svg>
                </div>
              </div>
              <div className="lifecycleCopy"><h3>{t("Develop")}</h3><p>{t("Build readable code in small steps, with room for others to contribute.")}</p></div>
            </li>

            <li className="lifecycleStep">
              <div className="lifecycleVisual">
                <span>04</span>
                <div className="lifecycleIcon" aria-hidden="true">
                  <svg viewBox="0 0 120 120">
                    <circle className="iconFill" cx="53" cy="53" r="31" />
                    <circle cx="53" cy="53" r="31" />
                    <path d="m76 76 24 24M36 54l12 12 23-26" />
                    <path d="M25 31v-8h8M73 23h8v8" />
                  </svg>
                </div>
              </div>
              <div className="lifecycleCopy"><h3>{t("Diagnose")}</h3><p>{t("Test real use, welcome bug reports, and improve reliability.")}</p></div>
            </li>

            <li className="lifecycleStep">
              <div className="lifecycleVisual">
                <span>05</span>
                <div className="lifecycleIcon" aria-hidden="true">
                  <svg viewBox="0 0 120 120">
                    <circle className="iconHalo" cx="60" cy="60" r="38" />
                    <path className="iconFill" d="m60 29 29 16v35L60 96 31 80V45Z" />
                    <path d="m31 45 29 16 29-16M60 61v35M46 37l29 16v16" />
                    <path d="M85 24v18M76 33l9-9 9 9" />
                  </svg>
                </div>
              </div>
              <div className="lifecycleCopy"><h3>{t("Deploy")}</h3><p>{t("Release useful software, document it, and grow with community feedback.")}</p></div>
            </li>
          </ol>
        </section>

        <JourneyProvider>
          <ProductJourney t={t} />
          <ProductJourneyGame />
        </JourneyProvider>

        <section className="contact" id="contact" data-pitch-section aria-labelledby="contact-title">
          <BackgroundDoodles variant="contact" />
          <div className="contactTop">
            <span>{t("04 / GROW THE COMMONS")}</span>
            <span>{t("THIRUVANANTHAPURAM · KERALA")}</span>
          </div>
          <div className="contactMain">
            <div>
              <p>{t("A little curiosity. A shared beginning.")}</p>
              <h2 id="contact-title">{t("What can we")}<br />{t("make open?")}</h2>
              <p className="contactSummary">{t("Found a bug, have an idea, or want to help build open source software? Say hello from Kerala or anywhere in the world. Code, design, documentation, and thoughtful feedback all belong here.")}</p>
              <Link className="primaryButton contactProject" href="/signup">{t("Join the community")} <ArrowIcon direction="up-right" /></Link>
            </div>
            <div className="contactActions">
              <a
                className="contactButton"
                href="https://wa.me/919074577932?text=Hello%20Vaniyathans%2C%20I%27d%20like%20to%20talk%20about%20your%20open%20source%20products."
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
            <nav aria-label={t("More ways to connect")}><Link href="/signup/workforce">{t("Build with the community")} <ArrowIcon direction="up-right" /></Link><Link href="/signin">{t("Sign in")} <ArrowIcon direction="up-right" /></Link></nav>
          </footer>
        </section>
      </PitchNavigation>
    </main>
  );
}
