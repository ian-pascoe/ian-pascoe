/** The career network's data model, shared by the build and the browser. */

/** A date with the precision it was written in: year, month, or day. */
export interface PartialDate {
  year: number;
  month?: number;
  day?: number;
  /** Start of the period in epoch milliseconds, for ordering and layout. */
  time: number;
  /** Human label: "2019", "Jun 2019", or "15 Jun 2019". */
  label: string;
  /** Machine value for <time datetime>. */
  iso: string;
}

export const LINE_COLORS = ["red", "blue", "green", "orange", "purple", "brown", "teal"] as const;
export type LineColor = (typeof LINE_COLORS)[number];

export interface Link {
  href: string;
  label: string;
}

export interface Profile {
  name: string;
  headline: string;
  location: string;
  email: string;
  links: { github: string; linkedin: string };
}

export interface Station {
  id: string;
  kind: "achievement" | "event" | "start";
  lineId: string | null;
  /** The achievement name (playful) or the event title. */
  name: string;
  /** Short plain label drawn on the map. */
  label: string;
  detail: string;
  metric?: string;
  metricLabel?: string;
  org?: string;
  tag?: string;
  date?: PartialDate;
  skills: string[];
  featured: boolean;
  link?: Link;
  /** Ordering key in epoch ms; interpolated inside the line when undated. */
  key: number;
}

export interface Line {
  id: string;
  code: string;
  color: LineColor;
  title: string;
  org: string;
  start: PartialDate;
  end: PartialDate | null;
  summary: string;
  link?: Link;
  /** Stations in travel order, oldest first, including the start station. */
  stations: Station[];
}

export interface Timeline {
  profile: Profile;
  lines: Line[];
  /** Events that no line departs from and that sit on no line. */
  loose: Station[];
  /** The station the first line departs from, if any. */
  origin: Station | null;
  builtAt: number;
}

/** Every station in the network, including the origin and loose events. */
export function allStations(timeline: Timeline): Station[] {
  return [
    ...(timeline.origin ? [timeline.origin] : []),
    ...timeline.lines.flatMap((l) => l.stations),
    ...timeline.loose,
  ];
}

/** Whole days elapsed since a date, counting the first day as day 1. */
export function dayCount(fromTime: number, now: number): number {
  return Math.max(1, Math.floor((now - fromTime) / 86_400_000) + 1);
}

export function lineRange(line: Line): string {
  return `${line.start.label} – ${line.end ? line.end.label : "now"}`;
}
