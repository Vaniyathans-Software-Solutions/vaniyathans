"use client";

import ArrowIcon from "@/app/ArrowIcon";
import { useLocale } from "@/app/i18n/LocaleProvider";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import RevealEffects from "./RevealEffects";
import HeroCarousel, { heroSlides } from "./HeroCarousel";
import SiteHeader from "./SiteHeader";
import { canScrollWithin, createPitchScrollGate } from "./pitch-scroll";

const INTERACTIVE = 'a, button, input, textarea, select, summary, [data-pitch-scroll], [contenteditable]:not([contenteditable="false"]), [role="button"], [role="textbox"], [role="slider"], [role="combobox"], [role="listbox"], [role="menu"], [role="tablist"], video, audio';
const titles = [...heroSlides.map((slide) => slide.tab), "Our process", "Product Journey map", "Spark to Launch", "Let’s connect"];
const lastHero = heroSlides.length - 1;

export default function PitchNavigation({ children }: { children: ReactNode }) {
  const { t } = useLocale();
  const [active, setActive] = useState(0);
  const [presenting, setPresenting] = useState(false);
  const current = useRef(0);
  const destination = useRef<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const goTo = useCallback((index: number, updateHash = true, instant = false) => {
    const next = Math.max(0, Math.min(titles.length - 1, index));
    const sections = document.querySelectorAll<HTMLElement>("#top > [data-pitch-section]");
    const section = sections[Math.max(0, next - lastHero)];
    if (!section) return;
    if (updateHash) {
      const hash = `#${next <= lastHero ? heroSlides[next].anchor : section.id}`;
      if (window.location.hash !== hash) window.history.pushState(window.history.state, "", hash);
    }
    current.current = next;
    destination.current = next;
    setActive(next);
    clearTimeout(timer.current);
    section.scrollIntoView({ block: "start", behavior: instant || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    timer.current = setTimeout(() => { destination.current = null; }, 1500);
  }, []);

  const move = useCallback((direction: number) => {
    goTo(current.current + direction);
  }, [goTo]);

  const advanceHero = useCallback(() => {
    // Automatic rotation stays inside the hero and never scrolls the page.
    if (current.current > lastHero) return;
    const next = (current.current + 1) % heroSlides.length;
    // Keep an existing hero link current without adding autoplay history entries.
    if (heroSlides.some((slide) => window.location.hash === `#${slide.anchor}`)) {
      window.history.replaceState(window.history.state, "", `#${heroSlides[next].anchor}`);
    }
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
    const followHash = (instant = false) => {
      const hash = window.location.hash;
      const heroIndex = heroSlides.findIndex((slide) => hash === `#${slide.anchor}`);
      if (heroIndex !== -1) goTo(heroIndex, false, instant);
      else if (hash === "#personal-brand") goTo(1, false, instant);
      else if (hash === "#top" || hash === "#expertise" || !hash) goTo(0, false, instant);
      else settle();
    };
    const hashChange = () => followHash();
    // Hashes are only available in the browser; resolve after hydration.
    const initialFrame = requestAnimationFrame(() => {
      if (window.location.hash) followHash(true);
      else sync();
    });
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("scrollend", settle);
    window.addEventListener("pointerdown", reset, { passive: true });
    window.addEventListener("resize", settle);
    window.addEventListener("hashchange", hashChange);
    window.addEventListener("popstate", hashChange);
    return () => {
      reset(); cancelAnimationFrame(frame); cancelAnimationFrame(initialFrame);
      window.removeEventListener("scroll", sync);
      window.removeEventListener("scrollend", settle);
      window.removeEventListener("pointerdown", reset);
      window.removeEventListener("resize", settle);
      window.removeEventListener("hashchange", hashChange);
      window.removeEventListener("popstate", hashChange);
    };
  }, [goTo]);

  useEffect(() => {
    const resetDestination = () => { destination.current = null; clearTimeout(timer.current); };
    if (!presenting) {
      // Normal mode never intercepts wheel, touch, or keyboard scrolling.
      resetDestination();
      window.addEventListener("wheel", resetDestination, { passive: true });
      window.addEventListener("touchstart", resetDestination, { passive: true });
      return () => {
        window.removeEventListener("wheel", resetDestination);
        window.removeEventListener("touchstart", resetDestination);
      };
    }

    const scrollDirection = createPitchScrollGate();
    const blocked = (target: Element | null) => Boolean(
      document.querySelector('dialog[open], [aria-modal="true"]') ||
      target?.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')
    );
    const wheel = (event: WheelEvent) => {
      if (event.defaultPrevented || !event.cancelable || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.deltaY === 0) return;
      const target = event.target instanceof Element ? event.target : null;
      if (blocked(target) || canScrollWithin(target, event.deltaY)) return;
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      const direction = scrollDirection(event.deltaY * unit, performance.now());
      if (direction) move(direction);
    };
    let touch: { x: number; y: number; target: Element | null; navigated: boolean } | null = null;
    const touchStart = (event: TouchEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      touch = event.touches.length === 1 && !blocked(target)
        ? { x: event.touches[0].clientX, y: event.touches[0].clientY, target, navigated: false }
        : null;
    };
    const touchMove = (event: TouchEvent) => {
      if (!touch || event.touches.length !== 1 || event.defaultPrevented || !event.cancelable) return;
      const point = event.touches[0];
      const delta = touch.y - point.clientY;
      const horizontal = touch.x - point.clientX;
      touch.x = point.clientX;
      touch.y = point.clientY;
      if (Math.abs(horizontal) > Math.abs(delta) || delta === 0) return;
      if (!touch.navigated && canScrollWithin(touch.target, delta)) return;
      event.preventDefault();
      if (touch.navigated) return;
      const direction = scrollDirection(delta, performance.now());
      if (direction) { touch.navigated = true; move(direction); }
    };
    const touchEnd = () => { touch = null; };
    const navigate = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (document.querySelector('dialog[open], [aria-modal="true"]')) return;
      if (event.key === "Escape") { setPresenting(false); return; }
      if (!["Enter", "ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "PageDown", "PageUp", " "].includes(event.key)) return;
      const target = event.target instanceof Element ? event.target : null;
      // Keep native controls, the journey game, and scrollable panels usable.
      if (target?.closest(INTERACTIVE) && (["Enter", " "].includes(event.key) || !target.closest("[data-pitch-controls]"))) return;
      event.preventDefault();
      if (!event.repeat) move(["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key) ? -1 : 1);
    };
    window.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("touchstart", touchStart, { passive: true });
    window.addEventListener("touchmove", touchMove, { passive: false });
    window.addEventListener("touchend", touchEnd);
    window.addEventListener("touchcancel", touchEnd);
    window.addEventListener("keydown", navigate);
    return () => {
      window.removeEventListener("wheel", wheel);
      window.removeEventListener("touchstart", touchStart);
      window.removeEventListener("touchmove", touchMove);
      window.removeEventListener("touchend", touchEnd);
      window.removeEventListener("touchcancel", touchEnd);
      window.removeEventListener("keydown", navigate);
    };
  }, [presenting, move]);

  return (
    <>
      <SiteHeader
        activeSection={active <= lastHero ? "expertise" : active === lastHero + 1 ? "method" : active === lastHero + 2 ? "journey" : null}
        onSelectSection={(section) => goTo(section === "expertise" ? 1 : section === "method" ? lastHero + 1 : lastHero + 2)}
      />
      <RevealEffects />
      <HeroCarousel autoPlay={!presenting && active <= lastHero} onAutoAdvance={advanceHero} activeIndex={Math.min(active, lastHero)} onSelect={goTo} onNext={() => move(1)} onPrevious={() => move(-1)} />
      {children}
      <nav className="pitchNavigation" data-pitch-controls data-presenting={presenting} aria-label={t("Pitch navigation")}>
        <button className="pitchToggle" type="button" aria-pressed={presenting} onClick={() => {
          setPresenting(!presenting);
          if (!presenting) goTo(current.current);
        }}>{presenting ? t("Exit pitch") : t("Pitch mode")}</button>
        <button type="button" disabled={active === 0} aria-label={t("Previous pitch slide")} onClick={() => move(-1)}><ArrowIcon direction="left" /></button>
        <span className="pitchPosition" aria-live={presenting ? "polite" : "off"} aria-atomic="true">{String(active + 1).padStart(2, "0")} / {String(titles.length).padStart(2, "0")}<span className="pitchTitle"> · {t(titles[active])}</span></span>
        <button type="button" disabled={active === titles.length - 1} aria-label={t("Next pitch slide")} onClick={() => move(1)}><ArrowIcon /></button>
        {presenting && <span className="pitchKeys">{t("Enter / arrows · Esc to exit")}</span>}
      </nav>
    </>
  );
}
