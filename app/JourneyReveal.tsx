"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./ProductJourney.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function JourneyReveal({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const section = root.current;
    if (!section) return;
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const select = gsap.utils.selector(section);
      const header = gsap.timeline({
        defaults: { duration: .8, ease: "power3.out" },
        scrollTrigger: { trigger: section, start: "top 78%", once: true },
      });
      header
        .from(select(`.${styles.header} img`), { opacity: 0, scale: .65, rotation: -12, ease: "back.out(1.5)" }, 0)
        .from(select(`.${styles.eyebrow}`), { opacity: 0, y: 12 }, .08)
        .from(select(`.${styles.titleLead}, .${styles.titleAccent}`), { opacity: 0, y: 26, rotationX: -20, stagger: .12 }, .14)
        .from(select(`.${styles.titleAccent}`), { "--underline-scale": 0, duration: .65 }, .5)
        .from(select(`.${styles.subtitle}, .${styles.headerActions}`), { opacity: 0, y: 12, stagger: .08 }, .32);

      // A soft light follows page scroll without pinning or intercepting input.
      gsap.fromTo(select(`.${styles.ambient}`), { yPercent: -20, rotation: -8 }, {
        yPercent: 20, rotation: 8, ease: "none",
        scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1 },
      });

      const cards = Array.from(section.querySelectorAll<HTMLElement>(`.${styles.step}`));
      const reveals = new Map<HTMLElement, gsap.core.Timeline>();
      cards.forEach((card, index) => {
        const reveal = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
        reveal
          .from(card, { opacity: 0, y: 28, scale: .96, duration: .7 }, 0)
          .from(card.querySelector(`.${styles.illustration}`), { opacity: 0, y: 16, rotation: index % 2 ? 5 : -5, scale: .85, duration: .75 }, .12)
          .from(card.querySelector(`.${styles.number}`), { scale: .45, rotation: -15, duration: .5, ease: "back.out(2)" }, .2)
          .from(card.querySelector(`.${styles.copy}`), { opacity: 0, y: 10, duration: .55 }, .22)
          .fromTo(card, { "--reveal-glow": 0 }, { "--reveal-glow": .65, duration: .3 }, .18)
          .to(card, { "--reveal-glow": 0, duration: .65 }, .48);

        const line = card.querySelector(`.${styles.connectorLine}`);
        const spark = card.querySelector(`.${styles.connectorSpark}`);
        if (line && spark) {
          reveal
            .from(line, { strokeDashoffset: 1, duration: .45, ease: "power2.inOut" }, .35)
            .fromTo(spark, { opacity: 0, attr: { cx: 3 } }, { opacity: 1, duration: .1 }, .35)
            .to(spark, { attr: { cx: 27 }, duration: .45, ease: "power2.inOut" }, .35)
            .to(spark, { opacity: 0, duration: .2 }, .8);
        }
        reveals.set(card, reveal);
      });

      // IntersectionObserver also sees clipping by the map's own overflow pane.
      // This reveals cards when actually visible on both page and nested scroll.
      const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
          .sort((a, b) => cards.indexOf(a.target as HTMLElement) - cards.indexOf(b.target as HTMLElement));
        visible.forEach((entry, index) => {
          reveals.get(entry.target as HTMLElement)?.delay(index * .13).restart(true);
          observer.unobserve(entry.target);
        });
      }, { threshold: .12, rootMargin: "0px 0px -28px 0px" });
      cards.forEach((card) => observer.observe(card));

      // Keyboard focus should never land on content still waiting for its reveal.
      const revealOnFocus = () => {
        header.progress(1);
        reveals.forEach((reveal) => reveal.progress(1));
        observer.disconnect();
      };
      section.addEventListener("focusin", revealOnFocus);
      return () => {
        observer.disconnect();
        section.removeEventListener("focusin", revealOnFocus);
      };
    });

    return () => media.revert();
  }, { scope: root });

  return (
    <section ref={root} className={styles.journey} id="journey" data-pitch-section data-gsap-reveal aria-labelledby="journey-title">
      <div className={styles.ambient} aria-hidden="true" />
      {children}
    </section>
  );
}
