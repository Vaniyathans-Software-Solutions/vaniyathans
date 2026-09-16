import type { CSSProperties } from "react";
import Image from "next/image";
import { journeySteps } from "./journey-game";
import styles from "./ProductJourney.module.css";

// Artwork cells and translated copy belong to a stage, regardless of its order.
const mapDetails: Record<(typeof journeySteps)[number]["title"], {
  illustration: number;
  existingCopy: [string, string];
  anchor?: string;
}> = {
  Discover: { illustration: 0, existingCopy: ["Share your idea", "Define the problem and goal."], anchor: "journey-discover" },
  "Define Users": { illustration: 2, existingCopy: ["Focus on users", "Define needs and success criteria."] },
  Strategize: { illustration: 1, existingCopy: ["Shape the scope", "Turn your idea into features."] },
  Prioritize: { illustration: 4, existingCopy: ["Set priorities", "Plan what matters most."] },
  Plan: { illustration: 3, existingCopy: ["Assign the work", "Set tasks and clear ownership."], anchor: "journey-plan" },
  Design: { illustration: 5, existingCopy: ["Design the experience", "Make every interaction intuitive."] },
  Build: { illustration: 6, existingCopy: ["Build together", "Deliver in small, reviewed increments."], anchor: "journey-launch" },
  Test: { illustration: 7, existingCopy: ["Test every detail", "Check quality, speed, and reliability."] },
  Launch: { illustration: 8, existingCopy: ["Launch and learn", "Release, gather feedback, and improve."] },
};

export default function ProductJourney({ t }: { t: (message: string) => string }) {
  const copy = (message: string, existing: string) => {
    const translated = t(message);
    return translated !== message || t(existing) === existing ? translated : t(existing);
  };
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
                <p className={styles.stepSubtitle}>{copy(step.subtitle, details.existingCopy[0])}</p>
                <p className={styles.description}>{copy(step.description, details.existingCopy[1])}</p>
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
