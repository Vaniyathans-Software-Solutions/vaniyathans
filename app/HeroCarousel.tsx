"use client";

import ArrowIcon from "@/app/ArrowIcon";
import { useLocale } from "@/app/i18n/LocaleProvider";

import Link from "@/app/i18n/LocalizedLink";
import Image from "next/image";
import BackgroundDoodles from "./BackgroundDoodles";
import HeroGridBackground from "./HeroGridBackground";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";

type HeroSlide = {
  anchor: string;
  index: string;
  label: string;
  tab: string;
  title: string[];
  description: string;
  supporting?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  theme: string;
};

export const heroSlides: HeroSlide[] = [
  {
    anchor: "vision",
    index: "00",
    label: "One partner for your digital growth",
    tab: "Vision",
    title: ["Build Your Brand.", "Sell Your Vision.", "Automate Your Future."],
    description:
      "Personal websites. Webshops. Custom software. AI agents. One team to help you get discovered, grow your business, and work smarter.",
    primary: { label: "Start Your Project", href: "/signup/client" },
    secondary: { label: "How We Work", href: "#method" },
    theme: "vision",
  },
  {
    anchor: "personal-brand",
    index: "01",
    label: "Personal Brand Websites",
    tab: "Brand",
    title: ["Turn Your Name", "Into a Brand."],
    description:
      "A personal website that tells your story, showcases your work, and makes it easy for people to choose you.",
    supporting: "Your identity. Your story. Your digital presence.",
    primary: { label: "Build My Personal Brand", href: "/signup/client" },
    theme: "personal",
  },
  {
    anchor: "webshops",
    index: "02",
    label: "Websites & Webshops",
    tab: "Webshops",
    title: ["Turn Your Brand", "Into a Business."],
    description:
      "A website or online store that showcases your offer and gives customers a clear path from discovery to purchase.",
    supporting: "Showcase. Sell. Grow.",
    primary: { label: "Launch My Brand", href: "/signup/client" },
    theme: "commerce",
  },
  {
    anchor: "software",
    index: "03",
    label: "Custom Software",
    tab: "Software",
    title: ["Software Built Around", "Your Business."],
    description:
      "Applications, platforms, and connected workflows built around your team, your customers, and the way your business works.",
    supporting: "Your process. Your software. Your advantage.",
    primary: { label: "Build Custom Software", href: "/signup/client" },
    theme: "software",
  },
  {
    anchor: "ai-agents",
    index: "04",
    label: "AI Agents & Automation",
    tab: "AI agents",
    title: ["Put AI to Work", "for Your Business."],
    description:
      "AI agents that handle repetitive tasks, support customers, and help your team put business knowledge to work.",
    supporting: "Automate work. Accelerate decisions. Scale intelligently.",
    primary: { label: "Build My AI Agent", href: "/signup/client" },
    theme: "ai",
  },

];

function TabIcon({ theme }: { theme: string }) {
  return (
    <svg className="carouselTabIcon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {theme === "vision" && <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>}
      {theme === "personal" && <><circle cx="12" cy="7" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></>}
      {theme === "commerce" && <><path d="M4 8h16l1 13H3L4 8Z" /><path d="M8 9V6a4 4 0 0 1 8 0v3" /></>}
      {theme === "software" && <><path d="m7 6-6 6 6 6m10-12 6 6-6 6M14 3l-4 18" /></>}
      {theme === "ai" && <><rect x="4" y="7" width="16" height="14" rx="3" /><path d="M12 3v4M1 12v5m22-5v5M9 17h6" /><circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" /></>}
    </svg>
  );
}

type HeroCarouselProps = {
  autoPlay: boolean;
  onAutoAdvance: () => void;
  activeIndex: number;
  onSelect: (index: number) => void;
  onNext: () => void;
  onPrevious: () => void;
};

export default function HeroCarousel({ autoPlay, onAutoAdvance, activeIndex, onSelect, onNext, onPrevious }: HeroCarouselProps) {
  const { t, locale } = useLocale();
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const slides = heroSlides;
  const sectionRef = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!autoPlay || paused || hovered || focused) return;
    const rotation = window.setInterval(() => {
      const bounds = sectionRef.current?.getBoundingClientRect();
      if (document.hidden || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (!bounds || bounds.bottom <= window.innerHeight / 2 || bounds.top >= window.innerHeight / 2) return;
      onAutoAdvance();
    }, 7000);
    return () => window.clearInterval(rotation);
  }, [autoPlay, paused, hovered, focused, activeIndex, onAutoAdvance]);

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.target instanceof Element && event.target.closest("a, button")) return;
    pointerStart.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
    if (pointerStart.current === null) return;
    const distance = event.clientX - pointerStart.current.x;
    const vertical = event.clientY - pointerStart.current.y;
    pointerStart.current = null;
    if (Math.abs(distance) < 48 || Math.abs(distance) < Math.abs(vertical)) return;
    if (distance < 0) onNext();
    else onPrevious();
  };

  const slide = slides[activeIndex];

  return (
    <section
      ref={sectionRef}
      className="hero heroCarousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
      id="expertise"
      data-pitch-section
      data-theme={slide.theme}
      aria-roledescription="carousel"
      aria-label={t("Our vision and services")}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => { pointerStart.current = null; }}
    >
      {slides.map((item) => <span key={item.anchor} id={item.anchor} className="heroAnchor" aria-hidden="true" />)}
      <HeroGridBackground />
      <BackgroundDoodles variant="hero" />

      <article
        className="heroCopy heroSlide"
        key={slide.index}
        aria-roledescription="slide"
        aria-label={t("{number} of {total}", { number: activeIndex + 1, total: slides.length })}
      >
        <p className="eyebrow"><span /> {slide.index} — {t(slide.label)}</p>
        <h1 id={activeIndex === 0 ? "hero-title" : undefined}>
          {slide.title.map((line, index) => (
            <span className={index === slide.title.length - 1 ? "heroTitleAccent" : undefined} key={t(line)}>
              {t(line)}
            </span>
          ))}
        </h1>

        <div className="heroBottom">
          <div className="heroDescription">
            <p>{t(slide.description)}</p>
            {slide.supporting && <strong>{t(slide.supporting)}</strong>}
          </div>
          <div className="heroActions">
            <Link className="primaryButton" href={slide.primary.href}>
              {slide.theme === "personal" && locale === "en" ? "Build\u00a0My\u00a0Personal Brand" : t(slide.primary.label)} <ArrowIcon direction="down-right" />
            </Link>
            {slide.secondary && (
              <a className="secondaryButton" href={slide.secondary.href}>
                {t(slide.secondary.label)}
              </a>
            )}
          </div>
        </div>
      </article>

      <div className="heroOutcomeArt" aria-hidden="true">
        {slides.map((item, index) => (
          <Image
            key={item.theme}
            className={index === activeIndex ? "isActive" : undefined}
            src={`/hero-${item.theme}.png`}
            alt=""
            width={1280}
            height={1280}
            sizes="(max-width: 600px) 80vw, (max-width: 1100px) 380px, 40vw"
            preload={index === 0}
          />
        ))}
      </div>

      <div className="carouselControls" data-pitch-controls aria-label={t("Hero carousel controls")}>
        <div className="carouselTabs">
          {slides.map((item, index) => (
            <a
              className={index === activeIndex ? "isActive" : undefined}
              key={item.index}
              href={`#${item.anchor}`}
              aria-label={t("Show slide {number}: {label}", { number: index + 1, label: t(item.label) })}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={(event) => {
                if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                event.preventDefault();
                onSelect(index);
              }}
            >
              <span className="carouselTabLabel"><TabIcon theme={item.theme} />{t(item.tab)}</span>
              <i aria-hidden="true" />
            </a>
          ))}
        </div>
        <div className="carouselActions">
          {autoPlay && <button className="carouselPause" type="button" aria-label={paused ? t("Resume automatic slides") : t("Pause automatic slides")} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? t("Play") : t("Pause")}</button>}
          <button type="button" aria-label={t("Previous slide")} disabled={activeIndex === 0} onClick={onPrevious}><ArrowIcon direction="left" /></button>
          <button type="button" aria-label={activeIndex === slides.length - 1 ? t("Continue to our process") : t("Next slide")} onClick={onNext}><ArrowIcon /></button>
        </div>
      </div>

      <div className="heroRail" aria-hidden="true">
        <span>{t("PERSONAL BRAND × BUSINESS × SOFTWARE × AI")}</span>
        <span>{String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
      </div>
    </section>
  );
}
