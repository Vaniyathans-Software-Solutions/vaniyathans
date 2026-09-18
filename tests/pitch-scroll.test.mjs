import assert from "node:assert/strict";
import test from "node:test";
import { createPitchScrollGate } from "../app/pitch-scroll.ts";

test("a wheel gesture advances once, including its long momentum tail", () => {
  const scroll = createPitchScrollGate();
  assert.equal(scroll(20, 0), 0);
  assert.equal(scroll(30, 20), 1);
  for (let time = 40; time < 1400; time += 40) assert.equal(scroll(8, time), 0);
  assert.equal(scroll(60, 1600), 1);
});

test("a new upward gesture goes back after the transition settles", () => {
  const scroll = createPitchScrollGate();
  assert.equal(scroll(120, 0), 1);
  assert.equal(scroll(-120, 250), 0, "do not interrupt the transition");
  assert.equal(scroll(-120, 800), -1);
});

test("tiny movements and direction changes do not accidentally change slides", () => {
  const scroll = createPitchScrollGate();
  assert.equal(scroll(30, 0), 0);
  assert.equal(scroll(-30, 10), 0);
  assert.equal(scroll(20, 400), 0, "do not accumulate across separate gestures");
  assert.equal(scroll(NaN, 410), 0);
  assert.equal(scroll(0, 420), 0);
  assert.equal(scroll(28, 430), 1);
});
