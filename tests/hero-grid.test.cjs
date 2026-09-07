const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const source = fs.readFileSync(path.join(__dirname, '../app/heroGridMotion.ts'), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const api = {};
vm.runInNewContext(code, { exports: api, Math, Set });
const { createGridWorld, advanceGrid, occupiedLines, GRID_CELL } = api;

function randomSequence() {
  let state = 104729;
  return () => ((state = (state * 16807) % 2147483647) - 1) / 2147483646;
}

function glow(id, axis, x, y) {
  return { id, axis, points: [{ x: x - (axis === 'x' ? 32 : 0), y: y - (axis === 'y' ? 32 : 0) }, { x, y }],
    speed: 60, radius: 1, opacity: .4, tail: 32, turned: false };
}

test('each line has at most one glow, including tails and turns, over repeated journeys', () => {
  for (const [width, height] of [[1440, 900], [768, 1024], [390, 844], [2560, 1440]]) {
    const world = createGridWorld(width, height, randomSequence());
    let turns = 0;
    for (let frame = 0; frame < 1800; frame++) {
      advanceGrid(world, 1 / 30);
      const reserved = new Set();
      for (const item of world.glows) {
        for (const lane of occupiedLines([item])) {
          assert.ok(!reserved.has(lane), `duplicate ${lane} at ${width}x${height}, frame ${frame}`);
          reserved.add(lane);
        }
        const head = item.points.at(-1);
        assert.equal((item.axis === 'x' ? head.y : head.x) % GRID_CELL, 0);
        for (let i = 1; i < item.points.length; i++) {
          const a = item.points[i - 1], b = item.points[i];
          assert.ok(a.x === b.x || a.y === b.y, 'trail must follow right-angle grid segments');
        }
        if (item.turned) turns++;
      }
      assert.ok(world.glows.length <= 60);
      assert.ok(world.pulses.every(pulse => pulse.x % GRID_CELL === 0 && pulse.y % GRID_CELL === 0));
    }
    assert.ok(turns > 0, 'free intersections should allow occasional turns');
  }
});

test('intersection pulses occur when a head reaches a crossing', () => {
  const world = createGridWorld(300, 300, () => .99);
  world.glows = [glow(1, 'x', 70, 76)];
  advanceGrid(world, .05);
  assert.equal(world.pulses.length, 0);
  advanceGrid(world, .05);
  assert.ok(world.pulses.some(pulse => pulse.x === 76 && pulse.y === 76));
});

test('a turn is denied when its destination line is occupied', () => {
  const world = createGridWorld(300, 300, () => 0);
  const turning = glow(0, 'x', 70, 76);
  world.glows = [turning, glow(1, 'y', 76, 180)];
  advanceGrid(world, .1);
  assert.equal(turning.axis, 'x');
  assert.equal(turning.turned, false);
});

test('a successful turn reserves the old line until the tail clears', () => {
  const world = createGridWorld(300, 300, () => 0);
  const turning = glow(0, 'x', 70, 76);
  world.glows = [turning];
  advanceGrid(world, .1);
  assert.equal(turning.axis, 'y');
  assert.ok(occupiedLines([turning]).has('x:76'));
  assert.ok(occupiedLines([turning]).has('y:76'));
  advanceGrid(world, .6);
  assert.ok(!occupiedLines([turning]).has('x:76'));
  assert.ok(occupiedLines([turning]).has('y:76'));
});

test('small viewports never create multiple glows on the available line', () => {
  const world = createGridWorld(60, 100, randomSequence());
  for (let i = 0; i < 300; i++) {
    advanceGrid(world, .05);
    assert.equal(world.glows.length, 1);
    assert.equal(occupiedLines(world.glows).size, 1);
  }
});
