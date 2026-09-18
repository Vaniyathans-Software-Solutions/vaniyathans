// A trackpad gesture includes its momentum tail, not just its first wheel event.
export function createPitchScrollGate() {
  let lastInput = -Infinity;
  let blockedUntil = 0;
  let accumulated = 0;
  let consumed = false;

  return (delta: number, now: number): -1 | 0 | 1 => {
    if (!Number.isFinite(delta) || delta === 0) return 0;
    if (now - lastInput > 180) {
      accumulated = 0;
      consumed = false;
    }
    lastInput = now;
    if (consumed || now < blockedUntil) return 0;
    if (Math.sign(delta) !== Math.sign(accumulated)) accumulated = 0;
    accumulated += delta;
    if (Math.abs(accumulated) < 48) return 0;
    consumed = true;
    blockedUntil = now + 700;
    return accumulated > 0 ? 1 : -1;
  };
}

export function canScrollWithin(target: Element | null, delta: number) {
  for (let element = target; element && element !== document.body; element = element.parentElement) {
    if (!(element instanceof HTMLElement)) continue;
    if (!/(auto|scroll)/.test(getComputedStyle(element).overflowY)) continue;
    const maxScroll = element.scrollHeight - element.clientHeight;
    if (maxScroll > 1 && (delta > 0 ? element.scrollTop < maxScroll - 1 : element.scrollTop > 1)) return true;
  }
  return false;
}
