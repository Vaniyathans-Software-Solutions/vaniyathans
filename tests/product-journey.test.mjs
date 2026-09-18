import assert from "node:assert/strict";
import test from "node:test";
import { getJourneyAgentStatus, initialJourney, journeyReducer, journeySteps } from "../app/journey-game.ts";

test("agent ownership follows progression, preserves completed work during review, and resets", () => {
  const statuses = state => journeySteps.map((_, index) => getJourneyAgentStatus(state, index));
  assert.ok(statuses(initialJourney).every(status => status === "ready"));
  let state = journeyReducer(initialJourney, { type: "start" });
  for (let i = 0; i < journeySteps.length; i++) {
    assert.deepEqual(statuses(state).flatMap((status, index) => status === "active" ? [index] : []), [i]);
    if (i === 3) assert.equal(journeySteps[state.active].agent, "Prion");
    state = journeyReducer(state, { type: "answer", index: journeySteps[i].answer });
    assert.equal(getJourneyAgentStatus(state, i), "complete");
    state = journeyReducer(state, { type: "select", index: 0 });
    assert.equal(getJourneyAgentStatus(state, 0), "complete", "review does not reactivate a completed agent");
    if (i < journeySteps.length - 1) state = journeyReducer(state, { type: "next" });
  }
  state = journeyReducer(state, { type: "launch" });
  assert.ok(statuses(state).every(status => status === "complete"));
  state = journeyReducer(state, { type: "reset" });
  assert.ok(statuses(state).every(status => status === "ready"));
});

test("checkpoints and launch stay locked until the preceding decisions are solved", () => {
  let state = journeyReducer(initialJourney, { type: "start" });
  assert.equal(journeyReducer(state, { type: "select", index: 8 }), state);
  assert.equal(journeyReducer(state, { type: "next" }), state);
  assert.equal(journeyReducer(state, { type: "launch" }), state);
  state = journeyReducer(state, { type: "answer", index: 0 });
  assert.equal(state.completed, 0);
  assert.equal(state.answer, 0);
  state = journeyReducer(state, { type: "answer", index: 1 });
  assert.equal(state.completed, 1);
  assert.equal(journeyReducer(state, { type: "answer", index: 1 }), state, "double activation cannot award another spark");
  assert.equal(journeyReducer(state, { type: "select", index: 2 }), state);
  assert.equal(journeyReducer(state, { type: "next" }).active, 1);
});

test("a full journey awards exactly nine sparks, allows review, launches, and resets", () => {
  let state = journeyReducer(initialJourney, { type: "start" });
  for (let i = 0; i < journeySteps.length; i++) {
    assert.equal(state.active, i);
    state = journeyReducer(state, { type: "answer", index: journeySteps[i].answer });
    assert.equal(state.completed, i + 1);
    if (i < 8) state = journeyReducer(state, { type: "next" });
  }
  state = journeyReducer(state, { type: "select", index: 0 });
  assert.equal(state.completed, 9);
  assert.equal(journeyReducer(state, { type: "answer", index: 1 }), state);
  state = journeyReducer(state, { type: "launch" });
  assert.equal(state.launched, true);
  assert.equal(journeyReducer(state, { type: "select", index: 1 }), state);
  assert.deepEqual(journeyReducer(state, { type: "reset" }), initialJourney);
});

test("invalid input cannot corrupt progression", () => {
  assert.equal(journeyReducer(initialJourney, { type: "answer", index: 1 }), initialJourney);
  for (const index of [-1, 9, NaN, 0.5]) {
    assert.equal(journeyReducer(initialJourney, { type: "select", index }), initialJourney);
  }
  const state = journeyReducer(initialJourney, { type: "start" });
  for (const index of [-1, 3, NaN, 0.5]) {
    assert.equal(journeyReducer(state, { type: "answer", index }), state);
  }
});
