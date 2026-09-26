/**
 * The fall. Scroll position picks a camera on the disk: the arrival shows the
 * whole disk with today at the reading position, each plate brings its
 * fragment round to the reading position and lights it gold, and the horizon
 * looks down into the hole. The disk renders only when the view changes: on
 * scroll, resize, or a pressed control. Nothing orbits on its own.
 */
import { observe } from "../../lib/observations";
import { camera, projectDiskPoint, shadowRadius, type View } from "./optics";
import { FRAGMENT, MAX_FRAGMENTS, MAX_YEARS, VERTEX } from "./shader";

/** Where the current fragment turns to: front-left of the hole, beside the plates. */
const PHI_READ = -2.3;
/** Phones bring the camera closer, so the hole fills the disk's window rather than floating small in it. */
const PHONE_ZOOM = 0.72;
const TAU = Math.PI * 2;
const VIEWPOINTS = { observer: null, edge: 0.035, face: 1.2 } as const;
type Viewpoint = keyof typeof VIEWPOINTS;

type Kind = "arrival" | "band" | "fragment" | "quiet" | "horizon";
interface Station {
  el: HTMLElement;
  kind: Kind;
  r: number;
  phi: number;
  time: number;
  anchor: number;
  /** Index into the fragment list, for fragment stations. */
  fragment: number;
}

interface State extends View {
  /** Fractional station index: how far through the fall the view is. */
  at: number;
}

const root = document.querySelector<HTMLElement>("[data-disk]")!;
const canvas = root.querySelector<HTMLCanvasElement>("[data-disk-canvas]")!;
const diskWindow = root.querySelector<HTMLElement>("[data-disk-window]")!;
const marker = root.querySelector<SVGCircleElement>("[data-marker]")!;
const leader = root.querySelector<SVGPathElement>("[data-leader]")!;
const core = root.querySelector<SVGCircleElement>("[data-core]")!;
const overlay = root.querySelector<SVGSVGElement>("[data-disk-overlay]")!;
const labels = new Map(
  [...root.querySelectorAll<SVGGElement>("[data-disk-label]")].map((el) => [el.dataset.diskLabel!, el]),
);
const yearLabels = [...root.querySelectorAll<SVGGElement>("[data-year-label]")];
/** Where the year numerals sit on their rings: the near side, right of the hole. */
const YEAR_PHI = -1.25;

const railMarker = document.querySelector<HTMLElement>("[data-rail-marker]");
const railYears = [...document.querySelectorAll<HTMLAnchorElement>("[data-rail-year]")];
const yearRadii = root.dataset.years!.split(" ").map(Number).slice(0, MAX_YEARS);
const firstTime = Number(root.dataset.firstTime);
const now = Number(root.dataset.now);
const narrowQuery = matchMedia("(max-width: 52rem)");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

const stations: Station[] = [];
let fragmentCount = 0;
for (const el of document.querySelectorAll<HTMLElement>("[data-station]")) {
  const kind = el.dataset.station as Kind;
  stations.push({
    el,
    kind,
    r: Number(el.dataset.r ?? 0),
    phi: Number(el.dataset.phi ?? 0),
    time: kind === "band" || kind === "fragment" ? Number(el.dataset.time) : now,
    anchor: 0,
    fragment: kind === "fragment" ? fragmentCount++ : -1,
  });
}
const fragments = stations.filter((s) => s.kind === "fragment");
const fragmentStation = fragments.map((f) => stations.indexOf(f));
const roleBands = new Set(
  fragments.filter((f) => f.el.closest(".band")?.querySelector("[data-role]")).map((f) => f.el.dataset.band!),
);

// Spin for each station: its fragment turned to the reading position. The arrival shows today there too,
// wound back whole turns so the disk only ever turns forward as the visitor falls.
const spinOf = (s: Station) => PHI_READ - s.phi;
const falling = stations.filter((s) => s.kind === "band" || s.kind === "fragment");
const firstSpin = spinOf(falling[0]!);
const lastSpin = spinOf(falling.at(-1)!);
const arrivalSpin = lastSpin - TAU * Math.ceil((lastSpin - firstSpin) / TAU);

let viewpoint: Viewpoint = "observer";

/**
 * Where the page's text sits, measured, so the disk is framed around it rather than by screen fractions:
 * the reading column's right edge on wide screens, the disk's window on phones (CSS owns its geometry), and the
 * circle the closing ask must fit inside.
 */
const layout = {
  columnRight: 0,
  window: { x: 0, y: 0, right: 0, bottom: 0 },
  horizon: { x: 0, y: 0, radius: 0 },
};
const leadColumn = document.querySelector<HTMLElement>("[data-column]")!;
const horizonCentre = document.querySelector<HTMLElement>("[data-horizon-centre]")!;

/** Half the short side of the viewport: the unit the camera's screen offsets are measured in. */
const unit = () => 0.5 * Math.min(innerWidth, innerHeight);

/** The camera distance at which the hole's shadow has a given on-screen radius (in `unit`s). */
function distForShadow(radius: number): number {
  let near = 3.2;
  let far = 40;
  for (let i = 0; i < 30; i++) {
    const mid = (near + far) / 2;
    const probe: View = { dist: mid, incl: 1, spin: 0, shiftX: 0, shiftY: 0 };
    if (shadowRadius(probe) > radius) near = mid;
    else far = mid;
  }
  return Math.min(14, Math.max(4.2, (near + far) / 2));
}

function stationView(s: Station): View {
  const narrow = narrowQuery.matches;
  const u = unit();
  // Wide: the hole sits midway between the reading column and the right edge. Phones: centred in the disk's window,
  // and closer, so the hole fills it.
  const shiftX = narrow ? (layout.window.x - innerWidth / 2) / u : layout.columnRight / (2 * u);
  const shiftY = narrow ? (innerHeight / 2 - layout.window.y) / u : -0.04;
  const zoom = narrow ? PHONE_ZOOM : 1;
  const override = VIEWPOINTS[viewpoint];
  switch (s.kind) {
    case "arrival":
      return { dist: 19 * zoom, incl: override ?? 0.2, spin: arrivalSpin, shiftX, shiftY };
    case "band":
      return { dist: (8 + 1.35 * s.r) * zoom, incl: override ?? 0.26, spin: spinOf(s), shiftX, shiftY };
    case "fragment":
      return { dist: (7.5 + 1.35 * s.r) * zoom, incl: override ?? 0.2, spin: spinOf(s), shiftX, shiftY };
    case "quiet":
      // After the last fragment the view pulls back and holds, so the closing sections read on the void.
      return { dist: 24 * zoom, incl: override ?? 0.34, spin: lastSpin + 0.6, shiftX, shiftY };
    case "horizon": {
      // The closing ask sits inside the hole's shadow: the camera comes as close as the text needs.
      const { x, y, radius } = layout.horizon;
      return {
        dist: distForShadow(radius / u),
        incl: 1.05,
        spin: lastSpin + 1.4,
        shiftX: (x - innerWidth / 2) / u,
        shiftY: (innerHeight / 2 - y) / u,
      };
    }
  }
}

/** Anchors: the scroll position at which each station's view is exact. */
function measure(): void {
  const narrow = narrowQuery.matches;
  const win = diskWindow.getBoundingClientRect();
  layout.window = { x: win.left + win.width / 2, y: win.top + win.height / 2, right: win.right, bottom: win.bottom };
  const masthead = document.querySelector(".masthead")?.getBoundingClientRect().bottom ?? 0;
  // Phones read in the screen the window leaves: below it when upright, beside it on its side. A plate taller than
  // that screen is read from its top.
  const areaTop = !narrow ? 0 : win.right >= innerWidth - 1 ? win.bottom : masthead;
  const readingLine = narrow ? (areaTop + innerHeight) / 2 : innerHeight * 0.46;
  const maxScroll = document.documentElement.scrollHeight - innerHeight;
  let previous = -Infinity;
  for (const s of stations) {
    const rect = s.el.getBoundingClientRect();
    const top = rect.top + scrollY;
    let anchor = s.kind === "arrival" ? 0 : s.kind === "horizon" ? maxScroll : top + rect.height / 2 - readingLine;
    if (narrow && s.kind !== "arrival" && s.kind !== "horizon") anchor = Math.min(anchor, top - areaTop);
    s.anchor = Math.max(Math.min(anchor, maxScroll), previous + 1);
    previous = s.anchor;
  }
  layout.columnRight = leadColumn.getBoundingClientRect().right;
  const centre = horizonCentre.getBoundingClientRect();
  layout.horizon = {
    x: centre.left + centre.width / 2,
    y: centre.top + scrollY - maxScroll + centre.height / 2,
    radius: Math.hypot(centre.width / 2, centre.height / 2) + 20,
  };
}

const smooth = (t: number) => t * t * (3 - 2 * t);

/** The view the page's scroll position asks for. */
function targetState(): State {
  const y = scrollY;
  let i = 0;
  while (i < stations.length - 2 && y >= stations[i + 1]!.anchor) i++;
  const a = stations[i]!;
  const b = stations[i + 1]!;
  const t = Math.min(1, Math.max(0, (y - a.anchor) / (b.anchor - a.anchor)));
  // Hold still while a plate is being read; move between plates.
  const e = smooth(Math.min(1, Math.max(0, (t - 0.18) / 0.64)));
  const va = stationView(a);
  const vb = stationView(b);
  return {
    dist: Math.exp(Math.log(va.dist) + (Math.log(vb.dist) - Math.log(va.dist)) * e),
    incl: va.incl + (vb.incl - va.incl) * e,
    spin: va.spin + (vb.spin - va.spin) * e,
    shiftX: va.shiftX + (vb.shiftX - va.shiftX) * e,
    shiftY: va.shiftY + (vb.shiftY - va.shiftY) * e,
    at: i + e,
  };
}

// ---------------------------------------------------------------- WebGL

/** The part of the screen the disk shows through, in CSS px from the top left; the rest is clipped away. */
interface Visible {
  right: number;
  bottom: number;
}

interface Renderer {
  /** Draws the whole canvas, or only what shows through `visible` (phones trace the window, not the screen). */
  draw(state: State, emphasis: Float32Array, visible?: Visible): void;
  resize(): void;
}

function createRenderer(): Renderer | null {
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false, depth: false, powerPreference: "high-performance" });
  if (!gl) return null;
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  };
  const vs = compile(gl.VERTEX_SHADER, VERTEX);
  const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT);
  if (!vs || !fs) return null;
  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    return null;
  }
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const u = (name: string) => gl.getUniformLocation(program, name);
  const uRes = u("uRes");
  const uCam = u("uCam");
  const uRight = u("uRight");
  const uUp = u("uUp");
  const uFwd = u("uFwd");
  const uShift = u("uShift");
  const uSpin = u("uSpin");
  const uFrag = u("uFrag");
  const uVeil = u("uVeil");

  const frags = new Float32Array(MAX_FRAGMENTS * 4);
  fragments.forEach((f, k) => {
    frags[k * 4] = f.r;
    frags[k * 4 + 1] = f.phi;
    frags[k * 4 + 2] = f.el.dataset.state === "retired" ? 1 : f.el.dataset.state === "in-progress" ? 2 : 0;
  });
  gl.uniform1i(u("uFragCount"), fragments.length);
  gl.uniform1fv(u("uYear"), new Float32Array([...yearRadii, ...Array(MAX_YEARS - yearRadii.length).fill(0)]));
  gl.uniform1i(u("uYearCount"), yearRadii.length);

  // Render at or below device resolution (capped at 1.5x) and let the browser scale up; calibration picks the scale.
  let quality = 1;

  const renderer: Renderer = {
    resize() {
      const scale = Math.min(devicePixelRatio, 1.5) * quality;
      canvas.width = Math.max(1, Math.round(innerWidth * scale));
      canvas.height = Math.max(1, Math.round(innerHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    },
    draw(state, emphasis, visible) {
      const cam = camera(state);
      if (visible) {
        const s = canvas.width / innerWidth;
        const y = Math.max(0, Math.floor((innerHeight - visible.bottom) * s) - 1);
        gl.enable(gl.SCISSOR_TEST);
        gl.scissor(0, y, Math.min(canvas.width, Math.ceil(visible.right * s) + 1), canvas.height - y);
      } else {
        gl.disable(gl.SCISSOR_TEST);
      }
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform3fv(uCam, cam.pos);
      gl.uniform3fv(uRight, cam.right);
      gl.uniform3fv(uUp, cam.up);
      gl.uniform3fv(uFwd, cam.fwd);
      gl.uniform2f(uShift, state.shiftX, state.shiftY);
      gl.uniform1f(uSpin, state.spin);
      for (let k = 0; k < fragments.length; k++) frags[k * 4 + 3] = emphasis[k]!;
      gl.uniform4fv(uFrag, frags);
      // Darken the sky behind the reading column on wide screens, lifting as the view centres on the horizon.
      // Fully dark to the column's edge, clear 200px past it.
      const veil = narrowQuery.matches ? 0 : 0.92 * Math.min(1, Math.max(0, state.shiftX / 0.3));
      gl.uniform3f(uVeil, (layout.columnRight + 200) / innerWidth, 184 / innerWidth, veil);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
  };

  // Calibrate on growing probes rather than a full frame up front. A tiny probe measures nothing on phones: browsers
  // coarsen performance.now to 0.1-1ms and reading a pixel back has a fixed cost, which together pinned phones to the
  // lowest scale. So subtract that fixed cost and double the probe until it takes long enough to measure (or reaches
  // the largest frame we would draw), then pick the scale that keeps a full frame near 12ms. A renderer too slow
  // even at the lowest scale (software WebGL) gets no disk at all.
  const probe = new Uint8Array(4);
  const timeAt = (w: number, h: number) => {
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    const started = performance.now();
    renderer.draw(targetState(), new Float32Array(fragments.length));
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, probe);
    return performance.now() - started;
  };
  const fullPixels = innerWidth * innerHeight * Math.min(devicePixelRatio, 1.5) ** 2;
  timeAt(1, 1); // the first draw also pays for compiling the program
  const overhead = timeAt(1, 1);
  let w = 64;
  let h = 36;
  let spent = timeAt(w, h) - overhead;
  while (spent < 8 && w * h * 4 <= fullPixels) {
    w *= 2;
    h *= 2;
    spent = timeAt(w, h) - overhead;
  }
  const perPixel = Math.max(spent, 0.05) / (w * h);
  if (perPixel * fullPixels * 0.4 ** 2 > 40) return null;
  quality = Math.min(1, Math.max(0.4, Math.sqrt(12 / (perPixel * fullPixels))));
  renderer.resize();
  return renderer;
}

// ---------------------------------------------------------------- overlays

function toScreen(p: { x: number; y: number }): [number, number] {
  const s = 0.5 * Math.min(innerWidth, innerHeight);
  return [innerWidth / 2 + p.x * s, innerHeight / 2 - p.y * s];
}

let current: Station | null = null;

interface Keepout {
  rects: DOMRect[];
  /** The hole on screen: labels stay clear of the photon ring's lensed arcs. */
  hole: { x: number; y: number; r: number };
}

const clearOf = (x: number, y: number, keep: Keepout) =>
  Math.hypot(x - keep.hole.x, y - keep.hole.y) > keep.hole.r &&
  !keep.rects.some((r) => x > r.left - 10 && x < r.right + 10 && y > r.top - 10 && y < r.bottom + 10);

/**
 * Sets a label along the fragment's orbit, just outside it, running the way the ring reads left to right, clear of
 * the page's text and of the photon ring. Returns false when no clean stretch of orbit exists.
 */
function placeOnOrbit(label: SVGGElement, state: State, f: Station, keep: Keepout): boolean {
  const phi = f.phi + state.spin;
  const at = projectDiskPoint(state, f.r, phi);
  if (!at) return false;
  const need = (label.querySelector("text")?.getComputedTextLength() ?? 160) + 24;
  // Try close outside the orbit first, then further out; follow the ring from the fragment each way.
  for (const offset of [0.35, 0.9, 1.6]) {
    for (const dir of [1, -1]) {
      const points: [number, number][] = [];
      let length = 0;
      for (let k = 0; k < 40 && length < need; k++) {
        const p = projectDiskPoint(state, f.r + offset, phi + dir * k * 0.035);
        if (!p) break;
        const [x, y] = toScreen(p);
        if (x < 8 || x > innerWidth - 8 || y < 64 || y > innerHeight - 8 || !clearOf(x, y, keep)) break;
        const last = points.at(-1);
        if (last) length += Math.hypot(x - last[0], y - last[1]);
        points.push([x, y]);
      }
      if (length < need) continue;
      const rightward = points.at(-1)![0] > points[0]![0];
      const path = rightward ? points : [...points].reverse();
      label.querySelector("[data-label-path]")!.setAttribute("d", `M${path.map((p) => p.join(" ")).join("L")}`);
      const text = label.querySelector("textPath")!;
      text.setAttribute("startOffset", rightward ? "18" : String(Math.max(0, length - need + 6)));
      const [fx, fy] = toScreen(at);
      label.querySelector("[data-label-tick]")!.setAttribute("d", `M${fx} ${fy}L${points[0]!.join(" ")}`);
      return true;
    }
  }
  return false;
}

function updateOverlays(state: State, emphasis: Float32Array, drawn: boolean, settled: boolean): void {
  overlay.setAttribute("viewBox", `0 0 ${innerWidth} ${innerHeight}`);

  // Arrival: the brightest fragments carry their figures, set along their own orbits, and the year
  // numerals run down the rings. Both are traced through the same bent light as the disk.
  // Tracing them is costly, so they are placed once the view settles and hidden while it moves.
  // Phones keep the plain list of the brightest instead: curved lettering at that size collides.
  const labelled = drawn && settled && !narrowQuery.matches && Math.max(0, 1 - state.at * 2.2) > 0.5;
  const taken: DOMRect[] = [];
  const keep: Keepout = { rects: [], hole: { x: 0, y: 0, r: 0 } };
  if (labelled) {
    keep.rects = [...document.querySelectorAll<HTMLElement>("[data-column] > *, .arrival__brightest")].map((el) =>
      el.getBoundingClientRect(),
    );
    const [hx, hy] = toScreen({ x: state.shiftX, y: state.shiftY });
    keep.hole = { x: hx, y: hy, r: shadowRadius(state) * unit() * 1.35 + 12 };
  }
  for (const f of fragments) {
    const label = labels.get(f.el.id);
    if (!label) continue;
    const placed = labelled && placeOnOrbit(label, state, f, keep);
    label.classList.toggle("is-shown", placed);
    if (placed) taken.push(label.getBoundingClientRect());
  }
  taken.push(...keep.rects);
  // Year numerals give way to the figures.
  for (const year of yearLabels) {
    const point = labelled ? projectDiskPoint(state, Number(year.dataset.r), YEAR_PHI) : null;
    if (point) year.setAttribute("transform", `translate(${toScreen(point).join(" ")})`);
    const box = point ? year.getBoundingClientRect() : null;
    const clear =
      box &&
      point &&
      clearOf(...toScreen(point), { rects: [], hole: keep.hole }) &&
      box.right < innerWidth - 4 &&
      !taken.some((t) => box.left < t.right && box.right > t.left && box.top < t.bottom && box.bottom > t.top);
    year.classList.toggle("is-shown", Boolean(clear));
  }

  // The fragment at the reading line: a gold ring round it, and a hairline back to its plate.
  const k = emphasis.reduce((best, w, i) => (w > (emphasis[best] ?? 0) ? i : best), 0);
  const w = emphasis[k] ?? 0;
  const f = fragments[k];
  const point = drawn && f && w > 0.55 ? projectDiskPoint(state, f.r, f.phi + state.spin) : null;
  marker.classList.toggle("is-shown", Boolean(point));
  core.classList.toggle("is-shown", Boolean(point));
  leader.classList.remove("is-shown");
  if (!point || !f) return;
  const [mx, my] = toScreen(point);
  const radius = 10 + 10 * w;
  marker.setAttribute("cx", String(mx));
  marker.setAttribute("cy", String(my));
  marker.setAttribute("r", String(radius));
  core.setAttribute("cx", String(mx));
  core.setAttribute("cy", String(my));
  if (narrowQuery.matches) return;
  const figure = f.el.querySelector<HTMLElement>("[data-figure]") ?? f.el;
  const rect = figure.getBoundingClientRect();
  const x1 = f.el.getBoundingClientRect().right + 24;
  const y1 = rect.top + Math.min(rect.height, 80) / 2;
  if (mx - radius - x1 < 48 || y1 < 0 || y1 > innerHeight) return;
  const angle = Math.atan2(y1 - my, x1 - mx);
  const ex = mx + Math.cos(angle) * (radius + 4);
  const ey = my + Math.sin(angle) * (radius + 4);
  const knee = x1 + Math.min(64, (ex - x1) * 0.3);
  leader.setAttribute("d", `M${x1} ${y1}H${knee}L${ex} ${ey}`);
  leader.classList.add("is-shown");
}

function updatePage(state: State): void {
  // Which plate is at the reading line.
  const nearest = stations[Math.round(state.at)]!;
  document.documentElement.dataset.at = nearest.kind;
  const next = Math.abs(state.at - Math.round(state.at)) < 0.35 && nearest.kind !== "arrival" ? nearest : null;
  if (next !== current) {
    current?.el.classList.remove("is-current");
    next?.el.classList.add("is-current");
    current = next;
    if (next && userMoved && !replay) noteRead(next);
  }

  // How deep in time the view is, on the masthead rail.
  const i = Math.min(Math.floor(state.at), stations.length - 2);
  const e = state.at - i;
  const time = stations[i]!.time + (stations[i + 1]!.time - stations[i]!.time) * e;
  const depth = (time - firstTime) / (now - firstTime);
  if (railMarker) {
    railMarker.style.setProperty("--depth", depth.toFixed(4));
    railMarker.classList.add("is-shown");
  }
  const year = new Date(time).getUTCFullYear();
  for (const link of railYears) {
    if (Number(link.dataset.railYear) === year && state.at > 0.5) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  }
}

// ---------------------------------------------------------------- observations

const read = new Set<string>();
let userMoved = false;

function noteRead(station: Station): void {
  if (station.kind === "horizon") {
    observe("full-descent");
    return;
  }
  if (station.kind !== "fragment") return;
  observe("first-light");
  const band = station.el.dataset.band!;
  if (roleBands.has(band)) read.add(band);
  if (read.size >= 2 && read.size >= roleBands.size) observe("both-bands");
}

// ---------------------------------------------------------------- the loop

let renderer = createRenderer();
if (!renderer) document.documentElement.classList.add("no-disk");

// A GPU reset or a backgrounded tab can take the context away: fall back to the still until it returns.
canvas.addEventListener("webglcontextlost", (event) => {
  event.preventDefault();
  renderer = null;
  document.documentElement.classList.add("no-disk");
});
canvas.addEventListener("webglcontextrestored", () => {
  renderer = createRenderer();
  document.documentElement.classList.toggle("no-disk", !renderer);
  relayout();
});

let shown: State | null = null;
let frame = 0;
let lastFrame = 0;

function emphasisFor(state: State): Float32Array {
  const out = new Float32Array(fragments.length);
  const arrival = Math.max(0, 1 - state.at * 2);
  fragments.forEach((f, k) => {
    const near = Math.max(0, 1 - Math.abs(state.at - fragmentStation[k]!) * 1.8);
    out[k] = Math.max(near, f.el.hasAttribute("data-featured") ? 0.42 * arrival : 0);
  });
  return out;
}

let open = -1;

/**
 * Phones: how far the disk's window has opened, 0 to 1, as the fall moves from the last closing section to the
 * horizon, where the hole fills the screen around the ask. Returns what shows through, for the renderer to trace.
 */
function phoneWindow(state: State): Visible | undefined {
  const next = narrowQuery.matches && renderer ? smooth(Math.min(1, Math.max(0, state.at - (stations.length - 2)))) : 0;
  if (Math.abs(next - open) > 1e-3) {
    open = next;
    root.style.setProperty("--open", next.toFixed(3));
  }
  if (!narrowQuery.matches) return undefined;
  const { right, bottom } = layout.window;
  return { right: right + (innerWidth - right) * open, bottom: bottom + (innerHeight - bottom) * open };
}

function tick(time: number): void {
  frame = 0;
  const target = targetState();
  // Ease in real time, so a slow frame covers more ground rather than stalling the fall.
  const dt = lastFrame ? Math.min(250, time - lastFrame) : 16;
  lastFrame = time;
  let settled = true;
  if (!shown || reduceMotion.matches) {
    shown = target;
  } else {
    const k = 1 - Math.exp(-dt / 110);
    const next = { ...shown };
    for (const key of ["dist", "incl", "spin", "shiftX", "shiftY", "at"] as const) {
      const delta = target[key] - shown[key];
      if (Math.abs(delta) > 1e-4) settled = false;
      next[key] = settled && Math.abs(delta) <= 1e-4 ? target[key] : shown[key] + delta * k;
    }
    shown = settled ? target : next;
  }
  const emphasis = emphasisFor(shown);
  renderer?.draw(shown, emphasis, phoneWindow(shown));
  updateOverlays(shown, emphasis, Boolean(renderer), settled);
  updatePage(shown);
  if (!settled) request();
  else lastFrame = 0;
}

function request(): void {
  if (!frame) frame = requestAnimationFrame(tick);
}

function relayout(): void {
  measure();
  renderer?.resize();
  request();
}

addEventListener("scroll", request, { passive: true });
addEventListener("resize", relayout);
narrowQuery.addEventListener("change", relayout);
document.fonts?.ready.then(relayout);
new ResizeObserver(() => {
  measure();
  request();
}).observe(document.querySelector("main")!);

// Scrolling that follows the visitor's own input counts toward observations; restoring a scroll position does not.
for (const type of ["wheel", "touchmove", "keydown", "pointerdown"] as const) {
  addEventListener(type, () => (userMoved = true), { passive: true });
}

// ---------------------------------------------------------------- viewpoints

for (const button of document.querySelectorAll<HTMLButtonElement>("[data-viewpoint]")) {
  button.addEventListener("click", () => {
    viewpoint = button.dataset.viewpoint as Viewpoint;
    for (const b of document.querySelectorAll("[data-viewpoint]")) {
      b.setAttribute("aria-pressed", String(b === button));
    }
    if (viewpoint !== "observer") observe("new-angle");
    request();
  });
}

// ---------------------------------------------------------------- the replay

const bar = document.querySelector<HTMLElement>("[data-replay-bar]")!;
const barYear = bar.querySelector<HTMLElement>("[data-replay-year]")!;
const barTitle = bar.querySelector<HTMLElement>("[data-replay-title]")!;
const replayStatus = document.querySelector<HTMLElement>("[data-replay-status]")!;
const PAUSE = 2600;
let replay: { timer: number; step: number } | null = null;

function stopReplay(completed = false): void {
  if (!replay) return;
  window.clearTimeout(replay.timer);
  replay = null;
  bar.hidden = true;
  replayStatus.textContent = "";
  if (completed) observe("free-fall");
  const landing = current?.el ?? document.querySelector<HTMLElement>("[data-station='horizon']");
  if (landing && bar.contains(document.activeElement)) {
    landing.tabIndex = -1;
    landing.focus({ preventScroll: true });
  }
}

function replayStep(): void {
  if (!replay) return;
  const station = [...falling, stations.at(-1)!][replay.step];
  if (!station) {
    stopReplay(true);
    return;
  }
  const title = station.el.querySelector("h2, h3")?.textContent?.trim() ?? "";
  // Only a date the record states is shown; an undated achievement shows its organisation instead.
  const stated = station.el.querySelector("time")?.textContent?.trim();
  const org = station.el.querySelector("[data-org]")?.textContent?.trim();
  barYear.textContent = station.kind === "horizon" ? "Now" : (stated ?? org ?? "");
  barTitle.textContent = station.kind === "horizon" ? "The horizon" : title;
  replayStatus.textContent = `${barYear.textContent}, ${barTitle.textContent}`;
  scrollTo({ top: station.anchor, behavior: reduceMotion.matches ? "auto" : "smooth" });
  replay.step++;
  replay.timer = window.setTimeout(replayStep, station.kind === "horizon" ? 900 : PAUSE);
}

for (const button of document.querySelectorAll<HTMLButtonElement>("[data-replay]")) {
  button.addEventListener("click", () => {
    measure();
    replay = { timer: 0, step: 0 };
    bar.hidden = false;
    bar.querySelector<HTMLButtonElement>("[data-replay-stop]")!.focus({ preventScroll: true });
    replayStep();
  });
}

bar.querySelector("[data-replay-stop]")!.addEventListener("click", () => stopReplay());
window.addEventListener("keydown", (event: KeyboardEvent) => {
  if (!replay) return;
  if (event.key === "Escape" || !bar.contains(event.target as Node)) stopReplay();
});
for (const type of ["wheel", "touchstart"] as const) {
  addEventListener(type, () => stopReplay(), { passive: true });
}

measure();
request();
