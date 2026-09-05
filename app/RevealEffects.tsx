"use client";

import { useEffect } from "react";

const TARGETS = [
  ".eyebrow", "h1", "h2", ".heroDescription", ".heroActions", ".carouselControls",
  ".lifecycleLabel", ".lifecycleHeader > p", ".lifecycleStep",
  ".journeyLabel", ".journeyHeader p", ".journeyCard", ".journeyLoop",
  ".contactTop", ".contactMain > div > p", ".contactProject", ".contactActions", ".contactFooter",
].join(", ");

type Reveal = { animation: Animation | null; visible: boolean };

export default function RevealEffects() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".pitchLanding");
    if (!root || !window.IntersectionObserver || !Element.prototype.animate) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dispose = () => {};

    const setup = () => {
      dispose();
      if (preference.matches) return;
      const reveals = new Map<HTMLElement, Reveal>();
      const visibleSections = new Set<HTMLElement>();
      const sections = root.querySelectorAll<HTMLElement>("[data-pitch-section]");

      const prepare = (element: HTMLElement, reveal: Reveal) => {
        const heading = element.matches("h1, h2");
        const animation = element.animate([
          { opacity: 0, translate: `0 ${heading ? 20 : 28}px` },
          { opacity: 1, translate: "0 0" },
        ], { duration: heading ? 850 : 720, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" });
        reveal.animation = animation;
        animation.pause();
        animation.onfinish = () => {
          animation.cancel();
          if (reveal.animation === animation) reveal.animation = null;
        };
      };
      const show = (reveal: Reveal) => {
        reveal.animation?.cancel();
        reveal.animation = null;
        reveal.visible = true;
      };
      const observer = new IntersectionObserver((entries) => {
        let order = 0;
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          const reveal = reveals.get(element);
          if (!reveal) return;
          if (element.contains(document.activeElement)) { show(reveal); observer.unobserve(element); return; }
          if (entry.isIntersecting && !reveal.visible) {
            reveal.visible = true;
            reveal.animation?.effect?.updateTiming({ delay: Math.min(order++, 4) * 85 });
            reveal.animation?.play();
            observer.unobserve(element);
          }
        });
      }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });

      const updateBackgrounds = () => sections.forEach((section) => {
        section.dataset.motionActive = String(visibleSections.has(section) && !document.hidden);
      });
      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const section = entry.target as HTMLElement;
          if (entry.isIntersecting) visibleSections.add(section);
          else if (visibleSections.delete(section)) {
            // Reset after the whole chapter leaves, so small scrolls cannot flicker cards.
            reveals.forEach((reveal, element) => {
              if (!section.contains(element) || element.contains(document.activeElement)) return;
              reveal.animation?.cancel();
              reveal.visible = false;
              prepare(element, reveal);
              observer.observe(element);
            });
          }
        });
        updateBackgrounds();
      });
      sections.forEach((section) => sectionObserver.observe(section));

      const register = () => {
        reveals.forEach((reveal, element) => {
          if (!root.contains(element)) {
            reveal.animation?.cancel();
            observer.unobserve(element);
            reveals.delete(element);
          }
        });
        root.querySelectorAll<HTMLElement>(TARGETS).forEach((element) => {
          if (reveals.has(element)) return;
          const reveal: Reveal = { animation: null, visible: false };
          reveals.set(element, reveal);
          prepare(element, reveal);
          observer.observe(element);
        });
      };
      register();
      // A new hero slide gets its own entrance without resetting the other sections.
      const mutations = new MutationObserver(register);
      mutations.observe(root, { childList: true, subtree: true });
      const focus = (event: FocusEvent) => reveals.forEach((reveal, element) => {
        if (event.target instanceof Node && element.contains(event.target)) {
          show(reveal);
          observer.unobserve(element);
        }
      });
      document.addEventListener("focusin", focus);
      document.addEventListener("visibilitychange", updateBackgrounds);
      dispose = () => {
        observer.disconnect();
        sectionObserver.disconnect();
        mutations.disconnect();
        reveals.forEach((reveal) => reveal.animation?.cancel());
        sections.forEach((section) => delete section.dataset.motionActive);
        document.removeEventListener("focusin", focus);
        document.removeEventListener("visibilitychange", updateBackgrounds);
      };
    };
    setup();
    preference.addEventListener("change", setup);
    return () => { dispose(); preference.removeEventListener("change", setup); };
  }, []);
  return null;
}
