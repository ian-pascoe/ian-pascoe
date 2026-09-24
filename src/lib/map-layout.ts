import type { Line, Station, Timeline } from "./network";

/**
 * Schematic geometry for the network diagram, in SVG user units.
 * Stations are placed by time, then pushed apart so labels never collide,
 * which is why the diagram is labeled "not to scale".
 */

export const MAP_WIDTH = 1320;
const PAD_LEFT = 44;
const PAD_RIGHT = 150;
const FIRST_TRACK_Y = 168;
const TRACK_GAP = 104;
const PARALLEL_GAP = 20;
const STATION_GAP = 46;
const CONVERGE_RUN = 40;

export interface PlacedStation {
  station: Station;
  x: number;
  y: number;
  labelSide: "above" | "below";
}

export interface PlacedLine {
  line: Line;
  path: string;
  /** The line's polyline, used to place the train during a ride. */
  points: [number, number][];
  stations: PlacedStation[];
  /** Horizontal extent the ride reveals, left to right. */
  from: number;
  to: number;
}

export interface MapLayout {
  width: number;
  height: number;
  lines: PlacedLine[];
  origin: PlacedStation | null;
  now: { x: number; top: number; bottom: number } | null;
  /** Converts a time to the x position the ride clock has reached. */
  xAt: (time: number) => number;
  start: number;
  end: number;
}

export function layoutMap(timeline: Timeline): MapLayout {
  const { lines, origin, builtAt } = timeline;
  const start = Math.min(origin?.key ?? Infinity, ...lines.map((l) => l.start.time));
  const end = builtAt;
  const xNow = MAP_WIDTH - PAD_RIGHT;
  const xFirst = PAD_LEFT + 12;
  const xLast = xNow - 56;
  const xAt = (time: number) => xFirst + ((time - start) / (end - start || 1)) * (xLast - xFirst);

  const current = lines.filter((l) => !l.end);
  const placedLines: PlacedLine[] = lines.map((line, index) => {
    const y = FIRST_TRACK_Y + index * TRACK_GAP;
    const currentIndex = current.indexOf(line);
    const convergeY = FIRST_TRACK_Y + currentIndex * PARALLEL_GAP;
    const bend = currentIndex >= 0 ? y - convergeY : 0;
    const joinX = xNow - CONVERGE_RUN;
    const bendX = joinX - bend;
    const lineStartX = index === 0 && origin ? xAt(origin.key) : xAt(line.start.time);
    const lineEndX = line.end ? xAt(line.end.time) : xNow;
    const maxStationX = currentIndex >= 0 ? Math.min(xLast, bendX - 28) : lineEndX;

    // Time-based x, then spaced so rotated labels never overlap.
    const minX = index === 0 && origin ? lineStartX + STATION_GAP : lineStartX;
    const xs = line.stations.map((s) => Math.min(Math.max(xAt(s.key), minX), maxStationX));
    for (let i = 1; i < xs.length; i++) xs[i] = Math.max(xs[i]!, xs[i - 1]! + STATION_GAP);
    if (xs.length && xs[xs.length - 1]! > maxStationX) {
      xs[xs.length - 1] = maxStationX;
      for (let i = xs.length - 2; i >= 0; i--) xs[i] = Math.min(xs[i]!, xs[i + 1]! - STATION_GAP);
    }
    if (xs.length > 1 && xs[0]! < minX) {
      const step = (maxStationX - minX) / (xs.length - 1);
      xs.forEach((_, i) => (xs[i] = minX + i * step));
    }

    const labelSide = index === 0 ? "above" : "below";
    const stations = line.stations.map((station, i) => ({ station, x: xs[i]!, y, labelSide }) as PlacedStation);

    const points: [number, number][] = line.end
      ? [[lineStartX, y], [lineEndX, y]]
      : bend
        ? [[lineStartX, y], [bendX, y], [joinX, convergeY], [xNow, convergeY]]
        : [[lineStartX, y], [xNow, y]];
    const path = points.map(([px, py], i) => `${i ? "L" : "M"} ${px} ${py}`).join(" ");

    return { line, path, points, stations, from: lineStartX, to: lineEndX };
  });

  const lastTrack = FIRST_TRACK_Y + Math.max(lines.length - 1, 0) * TRACK_GAP;
  const height = lastTrack + (lines.length > 1 ? 124 : 70);

  return {
    width: MAP_WIDTH,
    height,
    lines: placedLines,
    origin: origin ? { station: origin, x: xAt(origin.key), y: FIRST_TRACK_Y, labelSide: "above" } : null,
    now: current.length
      ? { x: xNow, top: FIRST_TRACK_Y - 14, bottom: FIRST_TRACK_Y + (current.length - 1) * PARALLEL_GAP + 14 }
      : null,
    xAt,
    start,
    end,
  };
}
