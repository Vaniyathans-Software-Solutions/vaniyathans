import type { CSSProperties } from "react";
import Image from "next/image";
import { journeySteps } from "./journey-game";
import JourneyAgent from "./JourneyAgent";
import JourneyReveal from "./JourneyReveal";
import styles from "./ProductJourney.module.css";

// Artwork cells belong to a stage, regardless of its order.
// Bounds include each complete scene and exclude neighbouring illustrations.
const artworkColumns = [[20, 415], [445, 385], [835, 419]] as const;
const artworkRows = [[70, 380], [475, 350], [835, 380]] as const;
const mapDetails: Record<(typeof journeySteps)[number]["title"], {
  illustration: number;
  anchor?: string;
}> = {
  Discover: { illustration: 0, anchor: "journey-discover" },
  "Define Users": { illustration: 2 },
  Strategize: { illustration: 1 },
  Prioritize: { illustration: 4 },
  Plan: { illustration: 3, anchor: "journey-plan" },
  Design: { illustration: 5 },
  Build: { illustration: 6, anchor: "journey-launch" },
  Test: { illustration: 7 },
  Launch: { illustration: 8 },
};

export default function ProductJourney({ t }: { t: (message: string) => string }) {
  return (
    <JourneyReveal>
      <div className={styles.inner}>
        <header className={styles.header}>
          <Image src="/vaniyathans-icon-logo2026.png" alt="" width={76} height={76} />
          <div className={styles.intro}>
            <p className={styles.eyebrow}>{t("Our open product journey")}</p>
            <h2 id="journey-title"><span className={styles.titleLead}>{t("From shared ideas")}</span>{" "}<span className={styles.titleAccent}>{t("to open source software.")}</span></h2>
            <p className={styles.subtitle}>{t("Useful products. Shared knowledge. Open collaboration.")}</p>
          </div>
          <div className={styles.headerActions}>
            <a className={styles.playLink} href="#spark-to-launch">{t("Play Spark to Launch")} <span aria-hidden="true">↗</span></a>
            <p className={styles.tagline}>{t("Made in Kerala. Improved together.")}</p>
          </div>
        </header>
        <ol className={styles.steps} aria-label={t("Your product journey")} tabIndex={0} data-pitch-scroll>
          {journeySteps.map((step, index) => {
            const details = mapDetails[step.title];
            const [artX, artWidth] = artworkColumns[details.illustration % 3];
            const [artY, artHeight] = artworkRows[Math.floor(details.illustration / 3)];
            return <li className={styles.step} key={step.title} id={details.anchor} style={{
              "--step-color": step.color,
            } as CSSProperties}>
              <div className={styles.cardHeader}>
                <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <h3>{t(step.title)}</h3>
                <div className={styles.agentCorner}><JourneyAgent index={index} /></div>
              </div>
              <svg className={styles.illustration} viewBox={`${artX} ${artY} ${artWidth} ${artHeight}`} aria-hidden="true" focusable="false">
                <image href="/journey-open-source.png" width="1254" height="1254" />
              </svg>
              <div className={styles.copy}>
                <p className={styles.stepSubtitle}>{t(step.subtitle)}</p>
                <p className={styles.description}>{t(step.description)}</p>
              </div>
              {index < journeySteps.length - 1 && <span className={styles.connector} aria-hidden="true">
                <svg viewBox="0 0 32 20" fill="none" focusable="false">
                  <path className={styles.connectorLine} d="M3 10H27M21 4L27 10L21 16" pathLength="1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <circle className={styles.connectorSpark} cx="3" cy="10" r="3" fill="currentColor" />
                </svg>
              </span>}
            </li>;
          })}
        </ol>
      </div>
    </JourneyReveal>
  );
}
