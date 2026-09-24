import { parse } from "yaml";
import { z } from "zod";
import raw from "../data/timeline.yaml?raw";
import { LINE_COLORS, type Line, type PartialDate, type Station, type Timeline } from "./network";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const DateSchema = z.union([z.number().int(), z.string()]).transform((value, ctx): PartialDate => {
  const text = String(value).trim();
  const match = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/.exec(text);
  if (!match) {
    ctx.addIssue({ code: "custom", message: `"${text}" is not a date; use YYYY, YYYY-MM, or YYYY-MM-DD` });
    return z.NEVER;
  }
  const year = Number(match[1]);
  const month = match[2] ? Number(match[2]) : undefined;
  const day = match[3] ? Number(match[3]) : undefined;
  if ((month !== undefined && (month < 1 || month > 12)) || (day !== undefined && (day < 1 || day > 31))) {
    ctx.addIssue({ code: "custom", message: `"${text}" has an out-of-range month or day` });
    return z.NEVER;
  }
  const label = day
    ? `${day} ${MONTHS[month! - 1]} ${year}`
    : month
      ? `${MONTHS[month - 1]} ${year}`
      : String(year);
  return { year, month, day, time: Date.UTC(year, (month ?? 1) - 1, day ?? 1), label, iso: text };
});

const LinkSchema = z.object({ href: z.url(), label: z.string().min(1) }).strict();

const ProfileSchema = z
  .object({
    name: z.string().min(1),
    headline: z.string().min(1),
    location: z.string().min(1),
    email: z.email(),
    links: z.object({ github: z.url(), linkedin: z.url() }).strict(),
  })
  .strict();

const Skills = z.array(z.string().min(1)).default([]);

const AchievementSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/).optional(),
    name: z.string().min(1),
    station: z.string().min(1).optional(),
    detail: z.string().min(1),
    metric: z.union([z.string(), z.number()]).transform(String).optional(),
    metricLabel: z.string().min(1).optional(),
    date: DateSchema.optional(),
    skills: Skills,
    featured: z.boolean().default(false),
    link: LinkSchema.optional(),
  })
  .strict()
  .refine((a) => (a.metric === undefined) === (a.metricLabel === undefined), {
    message: "metric and metricLabel go together; set both or neither",
  });

const SpanSchema = z
  .object({
    kind: z.literal("span"),
    id: z.string().regex(/^[a-z0-9-]+$/, "ids use lowercase letters, digits, and dashes"),
    code: z.string().regex(/^[A-Z0-9]$/, "code is one capital letter or digit, shown in the route bullet"),
    color: z.enum(LINE_COLORS),
    title: z.string().min(1),
    org: z.string().min(1),
    start: DateSchema,
    end: z.union([z.literal("present"), DateSchema]),
    startLabel: z.string().min(1).optional(),
    summary: z.string().min(1),
    link: LinkSchema.optional(),
    achievements: z.array(AchievementSchema).default([]),
  })
  .strict();

const EventSchema = z
  .object({
    kind: z.literal("event"),
    id: z.string().regex(/^[a-z0-9-]+$/, "ids use lowercase letters, digits, and dashes"),
    title: z.string().min(1),
    date: DateSchema,
    org: z.string().min(1).optional(),
    detail: z.string().min(1),
    tag: z.enum(["education", "certification", "launch", "milestone"]).optional(),
    on: z.string().optional(),
    skills: Skills,
    featured: z.boolean().default(false),
    link: LinkSchema.optional(),
  })
  .strict();

const FileSchema = z
  .object({
    profile: ProfileSchema,
    entries: z.array(z.discriminatedUnion("kind", [SpanSchema, EventSchema])).min(1),
  })
  .strict();

function fail(message: string): never {
  throw new Error(`src/data/timeline.yaml: ${message}`);
}

export function loadTimeline(source: string = raw, now: number = Date.now()): Timeline {
  const result = FileSchema.safeParse(parse(source));
  if (!result.success) fail(`invalid timeline\n${z.prettifyError(result.error)}`);
  const { profile, entries } = result.data;

  const spans = entries.filter((e) => e.kind === "span");
  const events = entries.filter((e) => e.kind === "event");
  const ids = new Set<string>();
  const claim = (id: string) => {
    if (ids.has(id)) fail(`duplicate id "${id}"; give one of them an explicit id`);
    ids.add(id);
    return id;
  };

  const lines: Line[] = spans
    .map((span) => {
      const end = span.end === "present" ? null : span.end;
      if (end && end.time < span.start.time) fail(`span "${span.id}" ends before it starts`);
      const lineEnd = end?.time ?? now;

      const start: Station = {
        id: claim(`${span.id}-start`),
        kind: "start",
        lineId: span.id,
        name: `${span.startLabel ?? "Joined"} ${span.org}`,
        label: span.startLabel ?? "Joined",
        detail: span.summary,
        org: span.org,
        date: span.start,
        skills: [],
        featured: false,
        link: span.link,
        key: span.start.time,
      };

      // Undated achievements are spread evenly between the dated anchors around them.
      const achievements = span.achievements.map((a) => ({ a, key: a.date?.time }));
      const anchors = [
        { index: -1, key: span.start.time },
        ...achievements.flatMap((x, index) => (x.key === undefined ? [] : [{ index, key: x.key }])),
        { index: achievements.length, key: lineEnd },
      ];
      for (let i = 0; i < anchors.length - 1; i++) {
        const from = anchors[i]!;
        const to = anchors[i + 1]!;
        const gap = to.index - from.index;
        for (let j = from.index + 1; j < to.index; j++) {
          achievements[j]!.key = from.key + ((to.key - from.key) * (j - from.index)) / gap;
        }
      }

      const stations: Station[] = achievements.map(({ a, key }) => ({
        id: claim(
          a.id ??
            `${span.id}-${a.name
              .toLowerCase()
              .normalize("NFKD")
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "")}`,
        ),
        kind: "achievement",
        lineId: span.id,
        name: a.name,
        label: a.station ?? a.name,
        detail: a.detail,
        metric: a.metric,
        metricLabel: a.metricLabel,
        org: span.org,
        date: a.date,
        skills: a.skills,
        featured: a.featured,
        link: a.link,
        key: key!,
      }));

      return {
        id: claim(span.id),
        code: span.code,
        color: span.color,
        title: span.title,
        org: span.org,
        start: span.start,
        end,
        summary: span.summary,
        link: span.link,
        stations: [start, ...stations],
      } satisfies Line;
    })
    .sort((a, b) => a.start.time - b.start.time);

  const lineById = new Map(lines.map((l) => [l.id, l]));
  let origin: Station | null = null;
  const loose: Station[] = [];

  for (const event of events) {
    const station: Station = {
      id: claim(event.id),
      kind: "event",
      lineId: event.on ?? null,
      name: event.title,
      label: event.org ?? event.title,
      detail: event.detail,
      org: event.org,
      tag: event.tag,
      date: event.date,
      skills: event.skills,
      featured: event.featured,
      link: event.link,
      key: event.date.time,
    };
    if (event.on) {
      const line = lineById.get(event.on) ?? fail(`event "${event.id}" is on unknown span "${event.on}"`);
      line.stations.push({ ...station, label: event.title });
      continue;
    }
    const departing = lines.find((l) => l.start.time >= event.date.time);
    if (departing && departing === lines[0] && !origin) origin = station;
    else loose.push(station);
  }

  for (const line of lines) line.stations.sort((a, b) => a.key - b.key);

  return { profile, lines, loose, origin, builtAt: now };
}

