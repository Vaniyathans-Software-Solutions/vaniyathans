"use client";

import Link from "next/link";
import BackgroundDoodles from "./BackgroundDoodles";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";

type HeroSlide = {
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

function NetworkGlobe() {
  return (
    <div className="globeStage" aria-hidden="true">
      <div className="globeGlow" />
      <svg className="buildGlobe" viewBox="0 0 620 620">
        <defs>
          <radialGradient id="globe-surface" cx="36%" cy="28%" r="72%">
            <stop offset="0%" stopColor="#8a5cff" stopOpacity=".2" />
            <stop offset="58%" stopColor="#183b72" stopOpacity=".12" />
            <stop offset="100%" stopColor="#061725" stopOpacity=".04" />
          </radialGradient>
          <clipPath id="globe-clip"><circle cx="310" cy="286" r="218" /></clipPath>
          <filter id="node-glow" x="-200%" y="-200%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <circle className="globeOuterRing" cx="310" cy="286" r="246" />
        <circle className="globeSurface" cx="310" cy="286" r="218" />

        <g className="globeGrid" clipPath="url(#globe-clip)">
          <ellipse cx="310" cy="286" rx="92" ry="218" />
          <ellipse cx="310" cy="286" rx="164" ry="218" />
          <ellipse cx="310" cy="286" rx="218" ry="74" />
          <ellipse cx="310" cy="286" rx="218" ry="148" />
          <path d="M92 286h436" />
          <path d="M310 68v436" />
        </g>

        <g className="globeRoutes" clipPath="url(#globe-clip)">
          <path className="globeRoute routeCyan" d="M127 226C216 132 392 143 501 243" />
          <path className="globeRoute routeMint" d="M111 328C232 426 408 411 519 292" />
          <path className="globeRoute routeCoral" d="M218 89C181 236 267 420 423 482" />
          <path className="globeRoute routeGold" d="M464 125C376 226 390 371 483 431" />
        </g>

        <g className="globeNodes" filter="url(#node-glow)">
          <circle className="globeNode nodeCyan" cx="155" cy="203" r="6" />
          <circle className="globeNode nodeMint" cx="258" cy="169" r="6" />
          <circle className="globeNode nodeCoral" cx="390" cy="181" r="6" />
          <circle className="globeNode nodeGold" cx="481" cy="230" r="6" />
          <circle className="globeNode nodeMint" cx="132" cy="343" r="6" />
          <circle className="globeNode nodeCyan" cx="265" cy="397" r="6" />
          <circle className="globeNode nodeGold" cx="410" cy="386" r="6" />
          <circle className="globeNode nodeCoral" cx="501" cy="315" r="6" />
          <circle className="globeNode nodeGold" cx="212" cy="111" r="6" />
          <circle className="globeNode nodeCyan" cx="407" cy="468" r="6" />
          <circle className="globeNode nodeCoral" cx="457" cy="145" r="6" />
          <circle className="globeNode nodeMint" cx="477" cy="414" r="6" />
        </g>

        <g className="routeTraveler travelerCyan"><path d="M-8-5 8 0-8 5Z" /><animateMotion dur="5.5s" repeatCount="indefinite" rotate="auto" path="M127 226C216 132 392 143 501 243" /></g>
        <g className="routeTraveler travelerMint"><path d="M-8-5 8 0-8 5Z" /><animateMotion begin="-2s" dur="6.4s" repeatCount="indefinite" rotate="auto" path="M111 328C232 426 408 411 519 292" /></g>
        <g className="routeTraveler travelerCoral"><path d="M-8-5 8 0-8 5Z" /><animateMotion begin="-3.5s" dur="7.2s" repeatCount="indefinite" rotate="auto" path="M218 89C181 236 267 420 423 482" /></g>
        <g className="routeTraveler travelerGold"><path d="M-8-5 8 0-8 5Z" /><animateMotion begin="-1s" dur="5.8s" repeatCount="indefinite" rotate="auto" path="M464 125C376 226 390 371 483 431" /></g>
      </svg>

      <span className="globeZone zoneAmericas">BRAND <i>↘</i></span>
      <span className="globeZone zoneEurope">BUILD <i>↘</i></span>
      <span className="globeZone zoneAsia">AUTOMATE <i>↘</i></span>
      <div className="globeStatus">
        <span />
        <div><strong>IDEA TO IMPACT</strong><small>ONE TECHNOLOGY PARTNER</small></div>
      </div>
    </div>
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
      aria-label="Our vision and services"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => { pointerStart.current = null; }}
    >
      <div className="heroGrid" aria-hidden="true" />
      <BackgroundDoodles variant="hero" />
      <NetworkGlobe />

      <article
        className="heroCopy heroSlide"
        key={slide.index}
        aria-roledescription="slide"
        aria-label={`${activeIndex + 1} of ${slides.length}`}
      >
        <p className="eyebrow"><span /> {slide.index} — {slide.label}</p>
        <h1 id={activeIndex === 0 ? "hero-title" : undefined}>
          {slide.title.map((line, index) => (
            <span className={index === slide.title.length - 1 ? "heroTitleAccent" : undefined} key={line}>
              {line}
            </span>
          ))}
        </h1>

        <div className="heroBottom">
          <div className="heroDescription">
            <p>{slide.description}</p>
            {slide.supporting && <strong>{slide.supporting}</strong>}
          </div>
          <div className="heroActions">
            <Link className="primaryButton" href={slide.primary.href}>
              {slide.theme === "personal" ? "Build\u00a0My\u00a0Personal Brand" : slide.primary.label} <span aria-hidden="true">↘</span>
            </Link>
            {slide.secondary && (
              <a className="secondaryButton" href={slide.secondary.href}>
                {slide.secondary.label}
              </a>
            )}
          </div>
        </div>
      </article>

      <div className="carouselControls" data-pitch-controls aria-label="Hero carousel controls">
        <div className="carouselTabs">
          {slides.map((item, index) => (
            <button
              className={index === activeIndex ? "isActive" : undefined}
              key={item.index}
              type="button"
              aria-label={`Show slide ${index + 1}: ${item.label}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => onSelect(index)}
            >
              <span className="carouselTabLabel"><TabIcon theme={item.theme} />{item.tab}</span>
              <i aria-hidden="true" />
            </button>
          ))}
        </div>
        <div className="carouselActions">
          {autoPlay && <button className="carouselPause" type="button" aria-label={paused ? "Resume automatic slides" : "Pause automatic slides"} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "Play" : "Pause"}</button>}
          <button type="button" aria-label="Previous slide" disabled={activeIndex === 0} onClick={onPrevious}>←</button>
          <button type="button" aria-label={activeIndex === slides.length - 1 ? "Continue to our process" : "Next slide"} onClick={onNext}>→</button>
        </div>
      </div>

      <div className="heroRail" aria-hidden="true">
        <span>PERSONAL BRAND × BUSINESS × SOFTWARE × AI</span>
        <span>{String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
      </div>
    </section>
  );
}
