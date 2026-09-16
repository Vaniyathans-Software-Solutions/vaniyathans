import * as THREE from "three";
import { initialJourney, journeySteps, type JourneyState } from "./journey-game";

export type JourneyScene = {
  update: (state: JourneyState) => void;
  setPaused: (paused: boolean) => void;
  dispose: () => void;
};

// This module is loaded only when the journey approaches the viewport.
export function createJourneyScene(
  canvas: HTMLCanvasElement,
  host: HTMLElement,
  labels: (HTMLButtonElement | null)[],
  onSelect: (index: number) => void,
  onContextLost: () => void,
): JourneyScene {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0x000000, 0);
  const world = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-7, 7, 4.6, -4.6, .1, 80);
  camera.position.set(0, 12, 15);
  camera.lookAt(0, .25, 0);
  world.add(new THREE.HemisphereLight(0xffffff, 0xadb1e2, 2.4));
  const sunlight = new THREE.DirectionalLight(0xffffff, 3.1);
  sunlight.position.set(-5, 10, 7);
  world.add(sunlight);
  const fill = new THREE.DirectionalLight(0xd9e7ff, 1.5);
  fill.position.set(6, 4, -5);
  world.add(fill);

  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const materialCache = new Map<string, THREE.MeshStandardMaterial>();
  const material = (color: string) => {
    let result = materialCache.get(color);
    if (!result) {
      result = new THREE.MeshStandardMaterial({ color, roughness: .42, metalness: .08 });
      materials.add(result);
      materialCache.set(color, result);
    }
    return result;
  };
  const mesh = (parent: THREE.Object3D, geometry: THREE.BufferGeometry, color: string, x = 0, y = 0, z = 0) => {
    geometries.add(geometry);
    const object = new THREE.Mesh(geometry, material(color));
    object.position.set(x, y, z);
    parent.add(object);
    return object;
  };
  const box = (parent: THREE.Object3D, size: [number, number, number], color: string, x = 0, y = 0, z = 0) => mesh(parent, new THREE.BoxGeometry(...size), color, x, y, z);
  const sphere = (parent: THREE.Object3D, radius: number, color: string, x = 0, y = 0, z = 0) => mesh(parent, new THREE.SphereGeometry(radius, 24, 16), color, x, y, z);
  const cylinder = (parent: THREE.Object3D, top: number, bottom: number, height: number, color: string, x = 0, y = 0, z = 0) => mesh(parent, new THREE.CylinderGeometry(top, bottom, height, 48), color, x, y, z);
  const torus = (parent: THREE.Object3D, radius: number, tube: number, color: string, x = 0, y = 0, z = 0) => mesh(parent, new THREE.TorusGeometry(radius, tube, 10, 48), color, x, y, z);
  const line = (parent: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3, color: string, width = .04) => {
    const rod = cylinder(parent, width, width, a.distanceTo(b), color);
    rod.position.copy(a).add(b).multiplyScalar(.5);
    rod.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    return rod;
  };
  const white = "#ffffff";
  const ink = "#677193";
  const rocketModel = () => {
    const group = new THREE.Group();
    const body = sphere(group, .34, white, 0, .7);
    body.scale.y = 1.65;
    mesh(group, new THREE.ConeGeometry(.31, .45, 32), "#a17bf3", 0, 1.27);
    cylinder(group, .2, .24, .16, ink, 0, .19);
    const windowRim = torus(group, .135, .036, "#768adc", 0, .78, .305);
    windowRim.rotation.x = -.05;
    sphere(group, .116, "#63d8f2", 0, .78, .32).scale.z = .3;
    [-1, 1].forEach((side) => {
      const fin = mesh(group, new THREE.ConeGeometry(.19, .5, 3), "#9770eb", side * .3, .34);
      fin.rotation.z = -side * .32;
    });
    const flame = mesh(group, new THREE.ConeGeometry(.12, .4, 16), "#ffc566", 0, -.06);
    flame.rotation.z = Math.PI;
    return group;
  };

  const models: THREE.Group[] = [];
  const rings: THREE.Mesh[] = [];
  const sparks: THREE.Mesh[] = [];
  const hitTargets: THREE.Object3D[] = [];

  journeySteps.forEach((step, index) => {
    const island = new THREE.Group();
    island.position.set(step.position[0], 0, step.position[1]);
    island.userData.checkpoint = index;
    world.add(island);
    hitTargets.push(island);
    const pale = `#${new THREE.Color(step.color).lerp(new THREE.Color(white), .48).getHexString()}`;
    cylinder(island, 1, .89, .28, pale, 0, -.03);
    cylinder(island, 1.01, 1.01, .08, white, 0, .15);
    const rim = torus(island, .96, .025, step.color, 0, .2);
    rim.rotation.x = Math.PI / 2;
    rings.push(rim);
    // Soft contact shadows without a costly shadow render pass.
    const shadowMaterial = new THREE.MeshBasicMaterial({ color: "#9a9cc1", transparent: true, opacity: .09, depthWrite: false });
    materials.add(shadowMaterial);
    const shadowGeometry = new THREE.CircleGeometry(1.14, 48);
    geometries.add(shadowGeometry);
    const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(.09, -.21, .1);
    island.add(shadow);

    const model = new THREE.Group();
    model.position.y = .2;
    model.rotation.y = -.3;
    island.add(model);
    models.push(model);
    if (step.title === "Discover") {
      cylinder(model, .23, .28, .12, "#aac5db", 0, .16);
      cylinder(model, .15, .19, .27, "#a6c9e2", 0, .32);
      sphere(model, .43, "#ffd46f", 0, .87);
      cylinder(model, .23, .16, .3, "#ffd46f", 0, .59);
      line(model, new THREE.Vector3(-.12, .74, .36), new THREE.Vector3(0, .56, .34), white, .018);
      line(model, new THREE.Vector3(.12, .74, .36), new THREE.Vector3(0, .56, .34), white, .018);
      for (let i = 0; i < 5; i++) {
        const angle = i * Math.PI / 4;
        line(model, new THREE.Vector3(Math.cos(angle) * .59, .88 + Math.sin(angle) * .59, 0), new THREE.Vector3(Math.cos(angle) * .72, .88 + Math.sin(angle) * .72, 0), "#ffd46f", .025);
      }
    } else if (step.title === "Strategize" || step.title === "Plan") {
      box(model, [1.05, 1.02, .12], pale, 0, .79);
      box(model, [.92, .88, .035], white, 0, .8, .08);
      [-.35, .35].forEach((x) => line(model, new THREE.Vector3(x, .05, 0), new THREE.Vector3(x, .6, 0), ink, .035));
      for (let i = 0; i < 6; i++) box(model, [.2, step.title === "Strategize" ? .19 : .12, .04], [step.color, "#ffd376", "#ad91ed"][i % 3], (i % 3 - 1) * .27, .6 + Math.floor(i / 3) * .3, .12);
      if (step.title === "Plan") box(model, [.45, .1, .06], step.color, 0, 1.34, .04);
    } else if (step.title === "Define Users") {
      [-.47, 0, .47].forEach((x, person) => {
        const z = person === 1 ? .2 : -.05;
        const height = person === 1 ? .53 : .42;
        cylinder(model, .15, .23, height, ["#83daf2", step.color, "#b99ae9"][person], x, .2 + height / 2, z);
        sphere(model, .17, "#fbd0b5", x, height + .36, z);
        sphere(model, .174, "#4a4469", x, height + .43, z - .045).scale.y = .6;
      });
      box(model, [.43, .28, .12], "#b89cef", .36, 1.32, 0);
      sphere(model, .025, white, .26, 1.33, .08);
      sphere(model, .025, white, .37, 1.33, .08);
      sphere(model, .025, white, .48, 1.33, .08);
    } else if (step.title === "Prioritize") {
      box(model, [.95, .08, .7], pale, 0, .12);
      [.35, .67, 1.02].forEach((height, i) => box(model, [.22, height, .38], ["#edb7d3", "#ed88b8", step.color][i], (i - 1) * .3, .18 + height / 2));
      mesh(model, new THREE.OctahedronGeometry(.18), "#ffd473", .3, 1.45);
    } else if (step.title === "Design" || step.title === "Build") {
      box(model, [1.2, .81, .11], step.title === "Design" ? step.color : ink, 0, .79);
      box(model, [1.06, .68, .025], "#edf5ff", 0, .8, .07);
      if (step.title === "Design") {
        box(model, [.43, .38, .03], "#b19af1", -.24, .82, .095);
        box(model, [.34, .09, .03], "#9dd8ee", .23, .99, .095);
        box(model, [.34, .2, .03], "#f2c098", .23, .78, .095);
        cylinder(model, .07, .09, .35, ink, 0, .27);
        box(model, [.47, .06, .29], ink, 0, .09);
      } else {
        for (let i = 0; i < 4; i++) box(model, [.26 + i % 2 * .26, .035, .03], i % 2 ? step.color : "#a58bdf", -.1 + i % 2 * .1, .99 - i * .13, .1);
        box(model, [1.25, .08, .73], "#b9c5df", 0, .34, .25);
        box(model, [.91, .015, .35], "#8393b6", 0, .39, .22);
      }
    } else if (step.title === "Test") {
      box(model, [.77, 1.01, .12], pale, -.17, .7);
      box(model, [.64, .87, .035], white, -.17, .72, .08);
      for (let i = 0; i < 3; i++) {
        sphere(model, .07, "#79cddd", -.32, .95 - i * .25, .1).scale.z = .3;
        box(model, [.26, .035, .02], "#bfcde7", -.05, .95 - i * .25, .12);
      }
      torus(model, .3, .06, step.color, .27, .8, .4);
      line(model, new THREE.Vector3(.48, .58, .4), new THREE.Vector3(.76, .27, .4), ink, .06);
    } else {
      const rocket = rocketModel();
      rocket.scale.setScalar(.83);
      rocket.position.y = .18;
      model.add(rocket);
      cylinder(model, .52, .65, .12, pale, 0, .03);
    }
    const spark = mesh(island, new THREE.OctahedronGeometry(.13), "#ffc763", -.75, 1.3, -.1);
    spark.visible = false;
    sparks.push(spark);
  });

  const paths: THREE.Mesh<THREE.TubeGeometry, THREE.MeshStandardMaterial>[] = [];
  const curves: THREE.CatmullRomCurve3[] = [];
  journeySteps.slice(0, -1).forEach((step, index) => {
    const next = journeySteps[index + 1];
    const a = new THREE.Vector3(step.position[0], .05, step.position[1]);
    const b = new THREE.Vector3(next.position[0], .05, next.position[1]);
    const points = [a];
    if (a.x === b.x) {
      const outward = a.x > 0 ? 1.5 : -1.5;
      points.push(new THREE.Vector3(a.x + outward, .05, a.z + .8), new THREE.Vector3(b.x + outward, .05, b.z - .8));
    } else {
      points.push(a.clone().lerp(b, .33), a.clone().lerp(b, .67));
    }
    points.push(b);
    const curve = new THREE.CatmullRomCurve3(points);
    curves.push(curve);
    const geometry = new THREE.TubeGeometry(curve, 48, .095, 8, false);
    geometries.add(geometry);
    const colors: number[] = [];
    const from = new THREE.Color(step.color);
    const to = new THREE.Color(next.color);
    for (let ring = 0; ring <= 48; ring++) {
      const color = from.clone().lerp(to, ring / 48);
      for (let v = 0; v <= 8; v++) colors.push(color.r, color.g, color.b);
    }
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    const pathMaterial = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .55, transparent: true, opacity: .78 });
    materials.add(pathMaterial);
    const path = new THREE.Mesh(geometry, pathMaterial);
    world.add(path);
    paths.push(path);
  });

  // A tiny rocket follows the player; each island has its own reference-inspired model.
  const player = rocketModel();
  player.scale.setScalar(.38);
  player.rotation.z = -.28;
  world.add(player);
  const playerPosition = (index: number) => new THREE.Vector3(journeySteps[index].position[0] - .8, 1.25, journeySteps[index].position[1] + .48);
  player.position.copy(playerPosition(0));
  const confetti: THREE.Mesh[] = [];
  for (let i = 0; i < 35; i++) {
    const flake = mesh(world, new THREE.OctahedronGeometry(.045 + i % 3 * .018), journeySteps[i % 9].color, Math.sin(i * 7.3) * 5.6, 1 + (i % 7) * .33, Math.cos(i * 3.1) * 4.5);
    flake.visible = false;
    confetti.push(flake);
  }
  // Small scenery details make the world feel alive without external model downloads.
  [[-5.8, -2], [5.9, 2.3], [-2.1, 4.6], [2.4, -4.9]].forEach(([x, z], index) => {
    const decoration = mesh(world, new THREE.OctahedronGeometry(.11), ["#9edee9", "#e7b4e4", "#b3cfef", "#d2c4ec"][index], x, .35, z);
    decoration.rotation.z = .3;
    sphere(world, .055, "#c7c8e5", x + .25, .17, z + .2);
  });

  let state = initialJourney;
  let paused = false;
  let inView = false;
  let disposed = false;
  let contextLost = false;
  let frame = 0;
  let previousTime = 0;
  let elapsed = 0;
  let travel = 1;
  let launchTime = 0;
  let oldActive = 0;
  let travelStart = playerPosition(0);
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const point = new THREE.Vector3();

  const positionLabels = () => {
    journeySteps.forEach((step, index) => {
      point.set(step.position[0], -.05, step.position[1] + 1.06).project(camera);
      const label = labels[index];
      if (label) { label.style.left = `${(point.x + 1) * 50}%`; label.style.top = `${(1 - point.y) * 50}%`; }
    });
  };
  const render = () => { if (!disposed && !contextLost) renderer.render(world, camera); };
  const isAnimating = () => !disposed && !contextLost && !paused && !preference.matches && inView && !document.hidden;
  const animate = (now: number) => {
    frame = 0;
    if (!isAnimating()) return;
    const delta = previousTime ? Math.min((now - previousTime) / 1000, .05) : 0;
    previousTime = now;
    elapsed += delta;
    travel = Math.min(1, travel + delta * 1.3);
    const eased = travel * travel * (3 - 2 * travel);
    if (state.active === oldActive + 1 && travel < 1) {
      player.position.copy(curves[oldActive].getPoint(eased));
      player.position.x -= .8;
      player.position.z += .48;
      player.position.y = 1.25 + Math.sin(travel * Math.PI) * .5;
    } else player.position.lerpVectors(travelStart, playerPosition(state.active), eased);
    if (state.launched) { launchTime = Math.min(4, launchTime + delta); player.position.y += launchTime * launchTime * 1.8; }
    else player.position.y += Math.sin(elapsed * 2.5) * .06;
    player.rotation.z = -.2 + Math.sin(elapsed * 1.5) * .07;
    sparks.forEach((spark, index) => { spark.rotation.y = elapsed; spark.position.y = 1.3 + Math.sin(elapsed * 2 + index) * .075; });
    models.forEach((model, index) => { model.position.y = .2 + (index === state.active ? Math.sin(elapsed * 2) * .035 : 0); });
    confetti.forEach((flake, index) => {
      flake.visible = state.launched;
      if (state.launched) { flake.rotation.set(elapsed + index, elapsed * .6, index); flake.position.y = 1 + ((index * .31 - elapsed * .55) % 3 + 3) % 3; }
    });
    render();
    frame = requestAnimationFrame(animate);
  };
  const syncAnimation = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
    if (isAnimating()) frame = requestAnimationFrame(animate);
    else render();
  };
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (width <= 0 || height <= 0 || disposed) return;
    const aspect = width / height;
    const halfHeight = Math.max(4.65, 6.9 / aspect);
    camera.left = -halfHeight * aspect;
    camera.right = halfHeight * aspect;
    camera.top = halfHeight;
    camera.bottom = -halfHeight;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    renderer.setSize(width, height, false);
    positionLabels();
    render();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const visibilityObserver = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; syncAnimation(); });
  visibilityObserver.observe(host);
  document.addEventListener("visibilitychange", syncAnimation);
  preference.addEventListener("change", syncAnimation);
  const lost = (event: Event) => { event.preventDefault(); contextLost = true; cancelAnimationFrame(frame); onContextLost(); };
  canvas.addEventListener("webglcontextlost", lost);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let pointerDown: { x: number; y: number } | null = null;
  const down = (event: PointerEvent) => { pointerDown = { x: event.clientX, y: event.clientY }; };
  const pick = (event: PointerEvent) => {
    if (!pointerDown || Math.hypot(pointerDown.x - event.clientX, pointerDown.y - event.clientY) > 8) { pointerDown = null; return; }
    pointerDown = null;
    const rect = canvas.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    let object: THREE.Object3D | undefined = raycaster.intersectObjects(hitTargets, true)[0]?.object;
    while (object && object.userData.checkpoint === undefined) object = object.parent ?? undefined;
    const index = object?.userData.checkpoint;
    if (typeof index === "number" && index <= state.completed && !state.launched) onSelect(index);
  };
  canvas.addEventListener("pointerdown", down);
  canvas.addEventListener("pointerup", pick);
  resize();

  return {
    update(next) {
      if (disposed) return;
      if (next.active !== state.active) {
        travelStart = player.position.clone();
        oldActive = state.active;
        travel = 0;
      }
      if (!next.launched) launchTime = 0;
      state = next;
      rings.forEach((ring, index) => { ring.visible = index <= state.completed; });
      sparks.forEach((spark, index) => { spark.visible = index < state.completed; });
      paths.forEach((path, index) => { path.material.opacity = index < state.completed ? .95 : .7; });
      confetti.forEach((flake) => { flake.visible = state.launched; });
      if (!isAnimating()) player.position.copy(playerPosition(state.active));
      render();
    },
    setPaused(value) { paused = value; syncAnimation(); },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", syncAnimation);
      preference.removeEventListener("change", syncAnimation);
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointerup", pick);
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((item) => item.dispose());
      renderer.dispose();
      world.clear();
    },
  };
}
