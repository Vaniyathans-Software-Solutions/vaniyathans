import type { CSSProperties } from "react";
import Image from "next/image";
import { journeySteps } from "./journey-game";
import styles from "./ProductJourney.module.css";

// Artwork cells belong to a stage, regardless of its order.
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
    <section className={styles.journey} id="journey" data-pitch-section aria-labelledby="journey-title">
      <div className={styles.inner}>
        <header className={styles.header}>
          <Image src="/vaniyathans-icon-logo2026.png" alt="" width={76} height={76} />
          <div className={styles.intro}>
            <p className={styles.eyebrow}>{t("Product Journey map")}</p>
            <h2 id="journey-title">{t("From idea")} <span>{t("to launch.")}</span></h2>
            <p className={styles.subtitle}>{t("Simpler Tools. Bigger Possibilities.")}</p>
          </div>
          <a className={styles.playLink} href="#spark-to-launch">{t("Play Spark to Launch")} <span aria-hidden="true">↗</span></a>
        </header>
        <ol className={styles.steps} aria-label={t("Your product journey")}>
          {journeySteps.map((step, index) => {
            const details = mapDetails[step.title];
            return <li className={styles.step} key={step.title} id={details.anchor} style={{
              "--step-color": step.color,
              "--art-x": `${(details.illustration % 3) * 50}%`,
              "--art-y": `${Math.floor(details.illustration / 3) * 50}%`,
            } as CSSProperties}>
              <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div className={styles.illustration} aria-hidden="true" />
              <div className={styles.copy}>
                <h3>{t(step.title)}</h3>
                <p className={styles.stepSubtitle}>{t(step.subtitle)}</p>
                <p className={styles.description}>{t(step.description)}</p>
              </div>
              {index < journeySteps.length - 1 && <span className={styles.connector} aria-hidden="true">→</span>}
            </li>;
          })}
        </ol>
        <p className={styles.tagline}>{t("Ideas today. A better tomorrow.")}</p>
      </div>
    </section>
  );
}
