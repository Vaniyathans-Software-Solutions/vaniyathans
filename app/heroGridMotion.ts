export const GRID_CELL = 76;

export type Point = { x: number; y: number };
export type GridGlow = {
  id: number;
  axis: "x" | "y";
  points: Point[];
  speed: number;
  radius: number;
  opacity: number;
  tail: number;
  turned: boolean;
};
export type GridPulse = Point & { age: number; color: number };
export type GridWorld = {
  width: number;
  height: number;
  glows: GridGlow[];
  pulses: GridPulse[];
  serial: number;
  random: () => number;
};

const lineKey = (axis: "x" | "y", point: Point) => `${axis}:${axis === "x" ? point.y : point.x}`;

// Reserve both the head's lane and any lane its fading tail still occupies.
export function occupiedLines(glows: GridGlow[]) {
  const occupied = new Set<string>();
  for (const glow of glows) {
    occupied.add(lineKey(glow.axis, glow.points[glow.points.length - 1]));
    for (let i = 1; i < glow.points.length; i++) {
      const a = glow.points[i - 1], b = glow.points[i];
      if (a.x !== b.x || a.y !== b.y) occupied.add(lineKey(a.y === b.y ? "x" : "y", a));
    }
  }
  return occupied;
}

function populate(world: GridWorld, initial = false) {
  const lanes: { axis: "x" | "y"; point: Point }[] = [];
  for (let y = GRID_CELL; y < world.height; y += GRID_CELL) lanes.push({ axis: "x", point: { x: 0, y } });
  for (let x = GRID_CELL; x < world.width; x += GRID_CELL) lanes.push({ axis: "y", point: { x, y: 0 } });
  // Leave some intersections available for turns instead of filling every lane.
  const limit = Math.min(60, Math.ceil(lanes.length * .8));
  const occupied = occupiedLines(world.glows);
  const free = lanes.filter(lane => !occupied.has(lineKey(lane.axis, lane.point)));
  while (world.glows.length < limit && free.length) {
    const lane = free.splice(Math.floor(world.random() * free.length), 1)[0];
    const id = world.serial++;
    const bright = id % 6 === 0;
    const tail = bright ? 126 : 32 + (id % 3) * 14;
    const head = { ...lane.point };
    head[lane.axis] = initial ? world.random() * (lane.axis === "x" ? world.width : world.height) : -20;
    const start = { ...head, [lane.axis]: head[lane.axis] - tail };
    world.glows.push({ id, axis: lane.axis, points: [start, head], speed: 38 + world.random() * 30,
      radius: bright ? 2.6 : 1 + (id % 3) * .25, opacity: bright ? .86 : .3 + (id % 3) * .08,
      tail, turned: false });
  }
}

export function createGridWorld(width: number, height: number, random = Math.random): GridWorld {
  const world: GridWorld = { width, height, random, glows: [], pulses: [], serial: 0 };
  populate(world, true);
  return world;
}

function trimTail(glow: GridGlow) {
  let length = 0;
  for (let i = 1; i < glow.points.length; i++) {
    length += Math.abs(glow.points[i].x - glow.points[i - 1].x) + Math.abs(glow.points[i].y - glow.points[i - 1].y);
  }
  let excess = length - glow.tail;
  while (excess > 0 && glow.points.length > 1) {
    const a = glow.points[0], b = glow.points[1];
    const segment = Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
    if (segment <= excess) { glow.points.shift(); excess -= segment; }
    else {
      a.x += Math.sign(b.x - a.x) * excess;
      a.y += Math.sign(b.y - a.y) * excess;
      excess = 0;
    }
  }
}

export function advanceGrid(world: GridWorld, seconds: number) {
  world.pulses = world.pulses.filter(pulse => (pulse.age += seconds) < .7);
  for (const glow of world.glows) {
    let remaining = glow.speed * seconds;
    while (remaining > .00001) {
      const head = glow.points[glow.points.length - 1];
      const next = (Math.floor((head[glow.axis] + .00001) / GRID_CELL) + 1) * GRID_CELL;
      const distance = Math.min(remaining, next - head[glow.axis]);
      head[glow.axis] += distance;
      remaining -= distance;
      trimTail(glow);
      if (Math.abs(head[glow.axis] - next) > .00001) continue;
      head[glow.axis] = next;
      const inside = head.x > 0 && head.x < world.width && head.y > 0 && head.y < world.height;
      if (!inside) continue;
      if (!world.pulses.some(pulse => pulse.x === head.x && pulse.y === head.y && pulse.age < .3)) {
        world.pulses.push({ ...head, age: 0, color: glow.id % 2 });
      }
      if (glow.id % 4 !== 0 || glow.turned || world.random() > .22) continue;
      const nextAxis = glow.axis === "x" ? "y" : "x";
      const occupied = occupiedLines(world.glows.filter(other => other !== glow));
      if (occupied.has(lineKey(nextAxis, head))) continue;
      glow.axis = nextAxis;
      glow.turned = true;
      glow.points.push({ ...head });
    }
  }
  world.glows = world.glows.filter(glow => {
    const head = glow.points[glow.points.length - 1];
    return head.x < world.width + glow.tail + 24 && head.y < world.height + glow.tail + 24;
  });
  populate(world);
}
