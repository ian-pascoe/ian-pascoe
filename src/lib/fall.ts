/**
 * The fall: Ian's record laid out on an accretion disk. Every work is a
 * fragment on the ring of its date, the past on the outer rim, today just
 * outside the innermost stable orbit. The visitor falls through it band by
 * band: education on the outer rim, then each role from its start to now.
 */

import { type Exhibition, type Room, type Work } from "./exhibition";

/** Disk geometry in Schwarzschild radii (the horizon is r = 1). */
export const DISK = {
  /** Innermost stable circular orbit: the disk's inner edge. */
  inner: 3,
  /** Where "now" orbits, just outside the inner edge. */
  now: 3.35,
  /** Where the first year of the record orbits. */
  rim: 13,
  outer: 14.5,
} as const;

/** Angle between consecutive fragments, in radians, in the direction of orbit. */
const STEP = 0.82;

export interface Fragment {
  id: string;
  work: Work;
  room: Room;
  /** Orbit radius in Schwarzschild radii. */
  r: number;
  /** Angle on the disk at rest, in radians. */
  phi: number;
  /** Position in the fall, from 0. */
  index: number;
}

export interface Band {
  room: Room;
  /** An orbit entry: the role's own plate, sitting at its start. */
  r: number;
  phi: number;
  fragments: Fragment[];
  /** Orgs of earlier roles this one runs alongside: the fall rewinds to this band's start, and says so. */
  alongside: string[];
}

export interface Fall {
  bands: Band[];
  fragments: Fragment[];
  /** Year rings etched on the disk. */
  years: { year: number; r: number }[];
  firstTime: number;
  now: number;
}

/** A date's orbit: the first year on the rim, now at the inner edge, recent years given more room. */
export function radiusAt(time: number, firstTime: number, now: number): number {
  const u = Math.min(1, Math.max(0, (time - firstTime) / (now - firstTime)));
  return DISK.now + (DISK.rim - DISK.now) * Math.pow(1 - u, 0.7);
}

export function buildFall(exhibition: Exhibition): Fall {
  const now = exhibition.builtAt;
  const firstTime = Date.UTC(exhibition.firstYear, 0, 1);
  // Education and other single-event bands sit on the outer rim first; roles follow by start date.
  const rooms = [...exhibition.rooms].sort(
    (a, b) => Number(Boolean(a.role)) - Number(Boolean(b.role)) || a.start.time - b.start.time,
  );

  let index = 0;
  let phi = 0;
  const bands: Band[] = rooms.map((room) => {
    const alongside = room.role
      ? rooms
          .filter((other) => other !== room && other.role && other.start.time < room.start.time)
          .filter((other) => (other.end?.time ?? now) > room.start.time)
          .map((other) => other.org)
      : [];
    const band: Band = { room, r: radiusAt(room.start.time, firstTime, now), phi, fragments: [], alongside };
    if (room.role) phi -= STEP;
    for (const work of room.works) {
      band.fragments.push({ id: work.id, work, room, r: radiusAt(work.key, firstTime, now), phi, index: index++ });
      phi -= STEP;
    }
    return band;
  });

  const lastYear = new Date(now).getUTCFullYear();
  const years = Array.from({ length: lastYear - exhibition.firstYear + 1 }, (_, i) => {
    const year = exhibition.firstYear + i;
    return { year, r: radiusAt(Date.UTC(year, 0, 1), firstTime, now) };
  });

  return { bands, fragments: bands.flatMap((b) => b.fragments), years, firstTime, now };
}
