"use client";

import ArrowIcon from "@/app/ArrowIcon";
import { useLocale } from "@/app/i18n/LocaleProvider";

import Link from "@/app/i18n/LocalizedLink";
import Image from "next/image";
import BackgroundDoodles from "./BackgroundDoodles";
import HeroGridBackground from "./HeroGridBackground";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import "./hero-kerala.css";

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
  artwork: string;
};

export const heroSlides: HeroSlide[] = [
  {
    "anchor": "vision",
    "index": "00",
    "label": "Open source. Product first. Made in Kerala.",
    "tab": "Vision",
    "title": [
      "Open Source.",
      "Product First.",
      "Made in Kerala."
    ],
    "description": "Vaniyathans is an open source, product-first software company from Kerala. We build open source software that people can use, study, change, and share.",
    "primary": {
      "label": "Explore our products",
      "href": "#products"
    },
    "secondary": {
      "label": "How we build",
      "href": "#method"
    },
    "theme": "vision",
    "artwork": "/hero-open-source-vision.png"
  },
  {
    "anchor": "products",
    "index": "01",
    "label": "01 / OUR PRODUCTS",
    "tab": "Products",
    "title": [
      "Software. Systems.",
      "Design."
    ],
    "description": "Our product work starts with www.software-system.design. Explore it, bring your feedback, and help shape what we build next.",
    "supporting": "www.software-system.design",
    "primary": {
      "label": "Visit the product",
      "href": "https://www.software-system.design"
    },
    "theme": "personal",
    "artwork": "/hero-open-source-product.png"
  },
  {
    "anchor": "webshops",
    "index": "02",
    "label": "Open Source, by Principle",
    "tab": "Openness",
    "title": [
      "Your Software.",
      "Your Possibilities."
    ],
    "description": "Open source means building with transparency: explore the code, adapt it to your needs, and share improvements. Collaboration guides the products we create.",
    "supporting": "Use. Study. Change. Share.",
    "primary": {
      "label": "Our open approach",
      "href": "#method"
    },
    "theme": "commerce",
    "artwork": "/hero-open-source-openness.png"
  },
  {
    "anchor": "software",
    "index": "03",
    "label": "Product First, Community Always",
    "tab": "Community",
    "title": [
      "Real Problems.",
      "Shared Progress."
    ],
    "description": "We focus on useful products, thoughtful design, and maintainable code. Feedback, documentation, testing, and contributions help software grow beyond its first release.",
    "supporting": "Good products grow through shared knowledge.",
    "primary": {
      "label": "See our product journey",
      "href": "#journey"
    },
    "theme": "software",
    "artwork": "/hero-open-source-community.png"
  },
  {
    "anchor": "ai-agents",
    "index": "04",
    "label": "Rooted in Kerala. Open to the World.",
    "tab": "Kerala",
    "title": [
      "From KERALAM.",
      "For Everyone."
    ],
    "description": "From Thiruvananthapuram, we bring Kerala’s spirit of learning and community to software. Like the waterways that connect our land, we want ideas and knowledge to flow openly.",
    "supporting": "Nammude naadu. Shared knowledge. Open source collaboration.",
    "primary": {
      "label": "Build with us",
      "href": "#contact"
    },
    "theme": "ai",
    "artwork": "/hero-open-source-kerala.png"
  }
];

function TabIcon({ theme }: { theme: string }) {
  return (
    <svg className="carouselTabIcon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {theme === "vision" && <><circle cx="6" cy="5" r="2" /><circle cx="18" cy="5" r="2" /><circle cx="12" cy="19" r="2" /><path d="M6 7v3c0 3 6 2 6 7M18 7v3c0 3-6 2-6 7" /></>}
      {theme === "personal" && <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><path d="M10 6h7a1 1 0 0 1 1 1v7M6 10v7a1 1 0 0 0 1 1h7" /></>}
      {theme === "commerce" && <><path d="m8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16" /></>}
      {theme === "software" && <><circle cx="9" cy="7" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6M21 21v-3a6 6 0 0 0-4-5" /></>}
      {theme === "ai" && <><path d="M12 21c3-6 4-11 2-16M14 5C9 0 5 3 3 7c4-2 7-3 11-2ZM14 5c5-4 8-1 8 3-3-2-5-3-8-3ZM14 5c-4-1-7 3-6 6 1-3 3-4 6-6ZM2 21c3-2 5 2 8 0s5 2 8 0 3 0 4 0" /></>}
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
  const { t } = useLocale();
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
      className="hero heroCarousel heroKerala"
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
      aria-label={t("Our products and open source principles")}
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
            <Link className="primaryButton" href={slide.primary.href} onClick={(event) => {
              const target = slides.findIndex((item) => slide.primary.href === `#${item.anchor}`);
              if (target < 0 || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              event.preventDefault();
              onSelect(target);
            }}>
              {t(slide.primary.label)} <ArrowIcon direction="down-right" />
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
            src={item.artwork}
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
        <span>{t("KERALA × OPEN SOURCE × PRODUCTS × COMMUNITY")}</span>
        <span>{String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
      </div>
    </section>
  );
}
