/**
 * The optics shared by the shader and the page: the camera, and a CPU copy of
 * the shader's light-bending integrator, so labels on the page land exactly
 * where the GPU draws the matter they name.
 *
 * Units are Schwarzschild radii (the horizon is r = 1). The disk lies in the
 * y = 0 plane; a point at angle φ sits at (r cos φ, 0, r sin φ) and orbits
 * toward increasing φ.
 */

export type Vec3 = [number, number, number];

export interface View {
  /** Camera distance from the hole. */
  dist: number;
  /** Camera elevation above the disk plane, in radians. */
  incl: number;
  /** Rotation of the disk, in radians. */
  spin: number;
  /** Where the hole sits on screen, in half-short-side units from the centre (x right, y up). */
  shiftX: number;
  shiftY: number;
}

/** Focal length in half-short-side units: about a 64° field across the short side. */
export const FOCAL = 1.6;
/** The shader's integration budget; the CPU tracer mirrors it. */
export const STEPS = 180;

export interface Camera {
  pos: Vec3;
  right: Vec3;
  up: Vec3;
  fwd: Vec3;
}

export function camera(view: View): Camera {
  const c = Math.cos(view.incl);
  const s = Math.sin(view.incl);
  const pos: Vec3 = [0, view.dist * s, -view.dist * c];
  const fwd: Vec3 = [0, -s, c];
  // right = worldUp × fwd, up = fwd × right
  const right: Vec3 = [1, 0, 0];
  const up: Vec3 = [0, c, s];
  return { pos, right, up, fwd };
}

/** The ray leaving the camera through a screen point given in half-short-side units. */
export function rayThrough(cam: Camera, view: View, x: number, y: number): Vec3 {
  const sx = x - view.shiftX;
  const sy = y - view.shiftY;
  const d: Vec3 = [
    cam.fwd[0] * FOCAL + cam.right[0] * sx + cam.up[0] * sy,
    cam.fwd[1] * FOCAL + cam.right[1] * sx + cam.up[1] * sy,
    cam.fwd[2] * FOCAL + cam.right[2] * sx + cam.up[2] * sy,
  ];
  const n = Math.hypot(d[0], d[1], d[2]);
  return [d[0] / n, d[1] / n, d[2] / n];
}

/**
 * Follows one ray through curved space exactly as the shader does and
 * returns where it first crosses the disk plane, or null when it falls in or
 * escapes first.
 */
export function firstCrossing(origin: Vec3, dir: Vec3): Vec3 | null {
  let [px, py, pz] = origin;
  let [vx, vy, vz] = dir;
  const hx = py * vz - pz * vy;
  const hy = pz * vx - px * vz;
  const hz = px * vy - py * vx;
  const h2 = hx * hx + hy * hy + hz * hz;
  for (let i = 0; i < STEPS; i++) {
    const r2 = px * px + py * py + pz * pz;
    const r = Math.sqrt(r2);
    if (r < 1) return null;
    const dt = Math.min(2.5, Math.max(0.03, 0.07 * r));
    const k = (-1.5 * h2) / (r2 * r2 * r);
    vx += k * px * dt;
    vy += k * py * dt;
    vz += k * pz * dt;
    const nx = px + vx * dt;
    const ny = py + vy * dt;
    const nz = pz + vz * dt;
    if (py * ny < 0) {
      const f = py / (py - ny);
      return [px + (nx - px) * f, 0, pz + (nz - pz) * f];
    }
    px = nx;
    py = ny;
    pz = nz;
    if (r > 40 && px * vx + py * vy + pz * vz > 0) return null;
  }
  return null;
}

/**
 * Where a point on the disk appears on screen, in half-short-side units, found
 * by aiming rays and correcting the aim until the bent ray lands on it.
 * Returns null when no clean primary image exists (behind the hole, off the disk).
 */
export function projectDiskPoint(view: View, r: number, phi: number): { x: number; y: number } | null {
  const cam = camera(view);
  const target: [number, number] = [r * Math.cos(phi), r * Math.sin(phi)];
  // Straight-line guess: pinhole projection of the point.
  const rel: Vec3 = [target[0] - cam.pos[0], -cam.pos[1], target[1] - cam.pos[2]];
  const depth = rel[0] * cam.fwd[0] + rel[1] * cam.fwd[1] + rel[2] * cam.fwd[2];
  if (depth <= 0) return null;
  const x = view.shiftX + (FOCAL * (rel[0] * cam.right[0] + rel[1] * cam.right[1] + rel[2] * cam.right[2])) / depth;
  const y = view.shiftY + (FOCAL * (rel[0] * cam.up[0] + rel[1] * cam.up[1] + rel[2] * cam.up[2])) / depth;

  const land = (sx: number, sy: number) => firstCrossing(cam.pos, rayThrough(cam, view, sx, sy));
  // Matter behind the hole shows lensed up over its shadow, so aim progressively higher when the straight guess fails.
  for (const lift of [0, 0.15, 0.3, 0.45, 0.6]) {
    const found = solve(x, y + lift);
    if (found) return found;
  }
  return null;

  function solve(x0: number, y0: number): { x: number; y: number } | null {
    let sx = x0;
    let sy = y0;
    const e = 1e-3;
    for (let iteration = 0; iteration < 8; iteration++) {
      const hit = land(sx, sy);
      const hitX = land(sx + e, sy);
      const hitY = land(sx, sy + e);
      if (!hit || !hitX || !hitY) return null;
      const errX = target[0] - hit[0];
      const errZ = target[1] - hit[2];
      if (Math.hypot(errX, errZ) < 0.01) return { x: sx, y: sy };
      // Jacobian of landing point with respect to screen position.
      const a = (hitX[0] - hit[0]) / e;
      const b = (hitY[0] - hit[0]) / e;
      const c = (hitX[2] - hit[2]) / e;
      const d = (hitY[2] - hit[2]) / e;
      const det = a * d - b * c;
      if (Math.abs(det) < 1e-9) return null;
      sx += (d * errX - b * errZ) / det;
      sy += (-c * errX + a * errZ) / det;
    }
    return null;
  }
}

/** Apparent radius of the hole's shadow, in half-short-side units (critical impact parameter 3√3/2). */
export function shadowRadius(view: View): number {
  const b = (3 * Math.sqrt(3)) / 2;
  return FOCAL * Math.tan(Math.asin(Math.min(1, (b * Math.sqrt(1 - 1 / view.dist)) / view.dist)));
}
