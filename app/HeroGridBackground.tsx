"use client";

import { useEffect, useRef } from "react";
import { advanceGrid, createGridWorld, GRID_CELL } from "./heroGridMotion";
import type { Point } from "./heroGridMotion";

type Color = [number, number, number];
type Region = { left: number; top: number; right: number; bottom: number };
const rgba = (color: Color, alpha: number) => `rgba(${color.join(",")},${alpha})`;

function readColor(value: string): Color {
  const hex = value.trim().replace("#", "");
  if (/^[\da-f]{6}$/i.test(hex)) return [0, 2, 4].map(offset => parseInt(hex.slice(offset, offset + 2), 16)) as Color;
  return [87, 242, 197];
}

export default function HeroGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.closest("section");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !section || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let world = createGridWorld(0, 0);
    let colors: Color[] = [];
    let target: Color[] = [];
    let quietRegions: Region[] = [];
    let artwork = { x: 0, y: 0, radius: 200 };
    let frame = 0, previous = 0, elapsed = 0, lastMeasure = 0;
    let visible = false;

    function measure() {
      if (!canvas || !section || !ctx) return;
      const width = canvas.clientWidth, height = canvas.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      if (world.width !== width || world.height !== height || canvas.width !== Math.round(width * ratio)) {
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        world = createGridWorld(width, height);
      }
      const bounds = canvas.getBoundingClientRect();
      quietRegions = Array.from(section.querySelectorAll(".heroCopy, .carouselControls")).map(element => {
        const rect = element.getBoundingClientRect();
        return { left: rect.left - bounds.left - 12, right: rect.right - bounds.left + 12,
          top: rect.top - bounds.top - 12, bottom: rect.bottom - bounds.top + 12 };
      });
      const art = section.querySelector(".heroOutcomeArt")?.getBoundingClientRect();
      if (art) artwork = { x: art.left - bounds.left + art.width / 2, y: art.top - bounds.top + art.height / 2,
        radius: Math.max(120, art.width * .65) };
      const style = getComputedStyle(section);
      target = [readColor(style.getPropertyValue("--slide-accent")), readColor(style.getPropertyValue("--slide-secondary"))];
      if (!colors.length || reducedMotion.matches) colors = target.map(color => [...color]);
    }

    function quietAt(point: Point) {
      let opacity = 1;
      for (const region of quietRegions) {
        const dx = Math.max(region.left - point.x, 0, point.x - region.right);
        const dy = Math.max(region.top - point.y, 0, point.y - region.bottom);
        const distance = Math.min(1, Math.hypot(dx, dy) / 64);
        opacity = Math.min(opacity, .14 + .86 * distance * distance * (3 - 2 * distance));
      }
      return opacity;
    }

    function draw(seconds: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, world.width, world.height);
      const blend = 1 - Math.exp(-seconds / .35);
      colors = colors.map((color, i) => color.map((channel, j) => channel + (target[i][j] - channel) * blend) as Color);
      const time = reducedMotion.matches ? 0 : elapsed;
      // Broad gradients have no hard edges and stay centered behind the artwork.
      colors.forEach((color, index) => {
        const x = artwork.x + Math.sin(time * .12 + index * 2) * 38;
        const y = artwork.y + Math.cos(time * .09 + index * 3) * 30;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, artwork.radius);
        gradient.addColorStop(0, rgba(color, .18));
        gradient.addColorStop(.5, rgba(color, .065));
        gradient.addColorStop(1, rgba(color, 0));
        ctx.fillStyle = gradient;
        ctx.fillRect(x - artwork.radius, y - artwork.radius, artwork.radius * 2, artwork.radius * 2);
      });
      if (reducedMotion.matches) return;

      for (const pulse of world.pulses) {
        const alpha = Math.sin(Math.PI * pulse.age / .7) * .3 * quietAt(pulse);
        const color = colors[pulse.color];
        const radius = 7 + pulse.age * 10;
        const gradient = ctx.createRadialGradient(pulse.x, pulse.y, 0, pulse.x, pulse.y, radius);
        gradient.addColorStop(0, rgba(color, alpha));
        gradient.addColorStop(1, rgba(color, 0));
        ctx.fillStyle = gradient;
        ctx.fillRect(pulse.x - radius, pulse.y - radius, radius * 2, radius * 2);
        ctx.strokeStyle = rgba(color, alpha);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pulse.x - 7, pulse.y + .5); ctx.lineTo(pulse.x + 7, pulse.y + .5);
        ctx.moveTo(pulse.x + .5, pulse.y - 7); ctx.lineTo(pulse.x + .5, pulse.y + 7);
        ctx.stroke();
      }
      for (const glow of world.glows) {
        const color = colors[glow.id % 2];
        let distance = 0;
        for (let i = 1; i < glow.points.length; i++) {
          const a = glow.points[i - 1], b = glow.points[i];
          const length = Math.hypot(b.x - a.x, b.y - a.y);
          if (!length) continue;
          const gradient = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          gradient.addColorStop(0, rgba(color, glow.opacity * distance / glow.tail * quietAt(a)));
          distance += length;
          gradient.addColorStop(1, rgba(color, glow.opacity * Math.min(1, distance / glow.tail) * quietAt(b)));
          ctx.strokeStyle = gradient;
          ctx.lineWidth = glow.radius > 2 ? 1.4 : .8;
          ctx.beginPath(); ctx.moveTo(a.x + .5, a.y + .5); ctx.lineTo(b.x + .5, b.y + .5); ctx.stroke();
        }
        const head = glow.points[glow.points.length - 1];
        const alpha = glow.opacity * quietAt(head);
        const radius = glow.radius * 6;
        const halo = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, radius);
        halo.addColorStop(0, rgba(color, alpha * .65)); halo.addColorStop(1, rgba(color, 0));
        ctx.fillStyle = halo; ctx.fillRect(head.x - radius, head.y - radius, radius * 2, radius * 2);
        ctx.fillStyle = rgba(color.map(channel => channel * .45 + 255 * .55) as Color, alpha);
        ctx.beginPath(); ctx.arc(head.x + .5, head.y + .5, glow.radius, 0, Math.PI * 2); ctx.fill();
      }
    }

    function tick(now: number) {
      frame = 0;
      const seconds = previous ? Math.min((now - previous) / 1000, .05) : 0;
      previous = now;
      elapsed += seconds;
      if (now - lastMeasure > 250) { measure(); lastMeasure = now; }
      advanceGrid(world, seconds);
      draw(seconds);
      frame = requestAnimationFrame(tick);
    }

    function syncPlayback() {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      measure();
      draw(0);
      if (visible && !document.hidden && !reducedMotion.matches) frame = requestAnimationFrame(tick);
    }

    const resize = new ResizeObserver(syncPlayback);
    resize.observe(section);
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncPlayback(); });
    visibility.observe(section);
    const theme = new MutationObserver(() => { measure(); if (!frame) draw(0); });
    theme.observe(section, { attributes: true, attributeFilter: ["data-theme"] });
    reducedMotion.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    syncPlayback();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect(); visibility.disconnect(); theme.disconnect();
      reducedMotion.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, []);

  return <div className="heroGrid" aria-hidden="true" style={{ "--grid-cell": `${GRID_CELL}px` } as React.CSSProperties}>
    <canvas className="heroGridCanvas" ref={canvasRef} />
  </div>;
}
