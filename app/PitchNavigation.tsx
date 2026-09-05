"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import RevealEffects from "./RevealEffects";
import HeroCarousel, { heroSlides } from "./HeroCarousel";

const INTERACTIVE = 'a, button, input, textarea, select, summary, [contenteditable]:not([contenteditable="false"]), [role="button"], [role="textbox"], [role="slider"], [role="combobox"], [role="listbox"], [role="menu"], [role="tablist"], video, audio';
const titles = [...heroSlides.map((slide) => slide.tab), "Our process", "Journey · Discover", "Journey · Shape", "Journey · Deliver", "Let’s connect"];
const lastHero = heroSlides.length - 1;

export default function PitchNavigation({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(0);
  const [presenting, setPresenting] = useState(false);
  const current = useRef(0);
  const destination = useRef<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const goTo = useCallback((index: number) => {
    const next = Math.max(0, Math.min(titles.length - 1, index));
    const sections = document.querySelectorAll<HTMLElement>("#top > [data-pitch-section]");
    const section = sections[Math.max(0, next - lastHero)];
    if (!section) return;
    current.current = next;
    destination.current = next;
    setActive(next);
    clearTimeout(timer.current);
    section.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    timer.current = setTimeout(() => { destination.current = null; }, 1500);
  }, []);

  const move = useCallback((direction: number) => {
    goTo(current.current + direction);
  }, [goTo]);

  const advanceHero = useCallback(() => {
    // Automatic rotation stays inside the hero and never scrolls the page.
    if (current.current > lastHero) return;
    const next = (current.current + 1) % heroSlides.length;
    current.current = next;
    setActive(next);
  }, []);

  useEffect(() => {
    let frame = 0;
    const reset = () => { destination.current = null; clearTimeout(timer.current); };
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (destination.current !== null) return;
        const sections = Array.from(document.querySelectorAll<HTMLElement>("#top > [data-pitch-section]"));
        // Keep the current chapter selected while reading a tall section on mobile.
        let sectionIndex = 0;
        sections.forEach((section, index) => {
          if (section.getBoundingClientRect().top <= window.innerHeight / 3) sectionIndex = index;
        });
        const next = sectionIndex === 0 ? Math.min(current.current, lastHero) : lastHero + sectionIndex;
        current.current = next;
        setActive(next);
      });
    };
    const settle = () => { reset(); sync(); };
    const hashChange = () => {
      if (window.location.hash === "#top") goTo(0);
      else settle();
    };
    const navigate = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (document.querySelector('dialog[open], [aria-modal="true"]')) return;
      if (event.key === "Escape") { setPresenting(false); return; }
      if (!["Enter", "ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
      const target = event.target instanceof Element ? event.target : null;
      // Enter retains native activation on links and buttons; arrows also work in pitch controls.
      if (target?.closest(INTERACTIVE) && (event.key === "Enter" || !target.closest("[data-pitch-controls]"))) return;
      event.preventDefault();
      if (event.repeat) return;
      setPresenting(true);
      move(event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 1);
    };
    sync();
    window.addEventListener("keydown", navigate);
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("scrollend", settle);
    window.addEventListener("wheel", reset, { passive: true });
    window.addEventListener("touchstart", reset, { passive: true });
    window.addEventListener("pointerdown", reset, { passive: true });
    window.addEventListener("resize", settle);
    window.addEventListener("hashchange", hashChange);
    return () => {
      reset(); cancelAnimationFrame(frame);
      window.removeEventListener("keydown", navigate);
      window.removeEventListener("scroll", sync);
      window.removeEventListener("scrollend", settle);
      window.removeEventListener("wheel", reset);
      window.removeEventListener("touchstart", reset);
      window.removeEventListener("pointerdown", reset);
      window.removeEventListener("resize", settle);
      window.removeEventListener("hashchange", hashChange);
    };
  }, [goTo, move]);

  return (
    <>
      <RevealEffects />
      <HeroCarousel autoPlay={!presenting && active <= lastHero} onAutoAdvance={advanceHero} activeIndex={Math.min(active, lastHero)} onSelect={goTo} onNext={() => move(1)} onPrevious={() => move(-1)} />
      {children}
      <nav className="pitchNavigation" data-pitch-controls data-presenting={presenting} aria-label="Pitch navigation">
        <button className="pitchToggle" type="button" aria-pressed={presenting} onClick={() => {
          setPresenting(!presenting);
          if (!presenting) goTo(current.current);
        }}>{presenting ? "Exit pitch" : "Pitch mode"}</button>
        <button type="button" disabled={active === 0} aria-label="Previous pitch slide" onClick={() => move(-1)}>←</button>
        <span className="pitchPosition" aria-live={presenting ? "polite" : "off"} aria-atomic="true">{String(active + 1).padStart(2, "0")} / {String(titles.length).padStart(2, "0")}<span className="pitchTitle"> · {titles[active]}</span></span>
        <button type="button" disabled={active === titles.length - 1} aria-label="Next pitch slide" onClick={() => move(1)}>→</button>
        {presenting && <span className="pitchKeys">Enter / arrows · Esc to exit</span>}
      </nav>
    </>
  );
}
