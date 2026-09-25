/** The exhibition's data model, shared by the build and the browser. */

/** A date with the precision it was written in: year, month, or day. */
export interface PartialDate {
  year: number;
  month?: number;
  day?: number;
  /** Start of the period in epoch milliseconds, for ordering. */
  time: number;
  /** Human label: "2019", "Jun 2019", or "15 Jun 2019". */
  label: string;
  /** Machine value for <time datetime>. */
  iso: string;
}

export const PAINTS = ["oxblood", "green", "slate", "ochre", "plum", "stone"] as const;
export type Paint = (typeof PAINTS)[number];

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

/**
 * How a work is drawn. Every drawing is an exact picture of its fact:
 * a reduction keeps what remains of 100 squares, an increase adds to 100,
 * a count draws one dot per unit, a document is a seal, a text piece sets
 * the subject in type.
 */
export type Drawing =
  | { kind: "reduction"; percent: number }
  | { kind: "increase"; percent: number }
  | { kind: "count"; value: number; plus: boolean }
  | { kind: "document"; tag: string }
  | { kind: "text"; subject: string };

export interface Work {
  id: string;
  roomId: string;
  kind: "achievement" | "event";
  /** The work's title: the playful achievement name or the event title. */
  title: string;
  detail: string;
  metric?: string;
  metricLabel?: string;
  drawing: Drawing;
  date?: PartialDate;
  tag?: string;
  skills: string[];
  featured: boolean;
  link?: Link;
  /** Ordering key in epoch ms; interpolated inside the room when undated. */
  key: number;
  /** Catalogue number: the room's opening year and the work's place in it. */
  number: string;
}

export interface Room {
  id: string;
  /** Room number in walking order, from 1. */
  number: number;
  paint: Paint;
  org: string;
  /** Ian's role in the room, e.g. "Principal Software Engineer"; absent for event rooms. */
  role?: string;
  start: PartialDate;
  end: PartialDate | null;
  /** "Joined", "Founded", ...; absent for event rooms. */
  startLabel?: string;
  summary?: string;
  link?: Link;
  works: Work[];
}

export interface Exhibition {
  profile: Profile;
  /** Rooms in walking order: current roles, then past roles, then single events. */
  rooms: Room[];
  /** Every work, oldest first: the order of the guided tour. */
  tour: Work[];
  firstYear: number;
  lastYear: number;
  builtAt: number;
}

/** Whole days elapsed since a date, counting the first day as day 1. */
export function dayCount(fromTime: number, now: number): number {
  return Math.max(1, Math.floor((now - fromTime) / 86_400_000) + 1);
}

export function roomRange(room: Room): string {
  if (!room.role) return room.start.label;
  return `${room.start.label} – ${room.end ? room.end.label : "now"}`;
}

/** Skills sorted by name, each with the works that prove it. */
export function mediaIndex(exhibition: Exhibition): { skill: string; works: Work[] }[] {
  const bySkill = new Map<string, Work[]>();
  for (const work of exhibition.rooms.flatMap((r) => r.works)) {
    for (const skill of work.skills) bySkill.set(skill, [...(bySkill.get(skill) ?? []), work]);
  }
  return [...bySkill]
    .map(([skill, works]) => ({ skill, works }))
    .sort((a, b) => a.skill.localeCompare(b.skill, "en", { sensitivity: "base" }));
}
