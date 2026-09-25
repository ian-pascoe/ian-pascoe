import { parse } from "yaml";
import { z } from "zod";
import raw from "../data/timeline.yaml?raw";
import { PAINTS, STATUSES, type Drawing, type Exhibition, type PartialDate, type Room, type Status, type Work } from "./exhibition";
import { MARK_NAMES } from "./marks";

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
    subject: z.string().min(1).optional(),
    detail: z.string().min(1).optional(),
    metric: z.union([z.string(), z.number()]).transform(String).optional(),
    metricLabel: z.string().min(1).optional(),
    date: DateSchema.optional(),
    skills: Skills,
    featured: z.boolean().default(false),
    link: LinkSchema.optional(),
    status: z.enum(Object.keys(STATUSES) as [Status, ...Status[]]).optional(),
  })
  .strict()
  .refine((a) => (a.metric === undefined) === (a.metricLabel === undefined), {
    message: "metric and metricLabel go together; set both or neither",
  })
  .refine((a) => a.metric !== undefined || a.subject !== undefined, {
    message: "a work needs a metric or a subject to be drawn",
  });

const SpanSchema = z
  .object({
    kind: z.literal("span"),
    id: z.string().regex(/^[a-z0-9-]+$/, "ids use lowercase letters, digits, and dashes"),
    paint: z.enum(PAINTS),
    title: z.string().min(1),
    org: z.string().min(1),
    mark: z.enum(MARK_NAMES).optional(),
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
    mark: z.enum(MARK_NAMES).optional(),
    detail: z.string().min(1).optional(),
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

const slug = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Reads a metric as the drawing that pictures it exactly. */
function drawMetric(metric: string, where: string): Drawing {
  const text = metric.trim().replace("−", "-");
  const percent = /^(\+)?(\d{1,3})%$/.exec(text);
  if (percent) {
    const value = Number(percent[2]);
    if (percent[1]) return { kind: "increase", percent: value };
    if (value > 100) fail(`${where}: a reduction of "${metric}" is more than everything; use "+${value}%" for an increase`);
    return { kind: "reduction", percent: value };
  }
  const count = /^(\d{1,4})(\+)?$/.exec(text);
  if (count && Number(count[1]) >= 1 && Number(count[1]) <= 1000) {
    return { kind: "count", value: Number(count[1]), plus: Boolean(count[2]) };
  }
  const rank = /^(\d{1,3})(?:st|nd|rd|th) of (\d{1,3})$/.exec(text);
  if (rank && Number(rank[1]) >= 1 && Number(rank[1]) <= Number(rank[2]) && Number(rank[2]) <= 100) {
    return { kind: "count", value: Number(rank[2]), plus: false, place: Number(rank[1]) };
  }
  return fail(`${where}: metric "${metric}" can't be drawn; use a reduction like "75%", an increase like "+30%", a count from 1 to 1000 like "5" or "300+", or a ranking out of at most 100 like "1st of 15"`);
}

export function loadTimeline(source: string = raw, now: number = Date.now()): Exhibition {
  const result = FileSchema.safeParse(parse(source));
  if (!result.success) fail(`invalid timeline\n${z.prettifyError(result.error)}`);
  const { profile, entries } = result.data;

  const ids = new Set<string>();
  const claim = (id: string) => {
    if (ids.has(id)) fail(`duplicate id "${id}"; give one of them an explicit id`);
    ids.add(id);
    return id;
  };

  const rooms: Room[] = [];
  for (const span of entries.filter((e) => e.kind === "span")) {
    const end = span.end === "present" ? null : span.end;
    if (end && end.time < span.start.time) fail(`span "${span.id}" ends before it starts`);
    const roomEnd = end?.time ?? now;

    // Undated works are spread evenly between the dated anchors around them.
    const keys: (number | undefined)[] = span.achievements.map((a) => a.date?.time);
    const anchors = [
      { index: -1, key: span.start.time },
      ...keys.flatMap((key, index) => (key === undefined ? [] : [{ index, key }])),
      { index: keys.length, key: roomEnd },
    ];
    for (let i = 0; i < anchors.length - 1; i++) {
      const from = anchors[i]!;
      const to = anchors[i + 1]!;
      for (let j = from.index + 1; j < to.index; j++) {
        keys[j] = from.key + ((to.key - from.key) * (j - from.index)) / (to.index - from.index);
      }
    }

    rooms.push({
      id: claim(span.id),
      number: 0,
      paint: span.paint,
      org: span.org,
      mark: span.mark,
      role: span.title,
      start: span.start,
      end,
      startLabel: span.startLabel ?? "Joined",
      summary: span.summary,
      link: span.link,
      works: span.achievements.map((a, index) => ({
        id: claim(a.id ?? `${span.id}-${slug(a.name)}`),
        roomId: span.id,
        kind: "achievement",
        title: a.name,
        detail: a.detail,
        metric: a.metric,
        metricLabel: a.metricLabel,
        drawing: a.metric ? drawMetric(a.metric, `"${a.name}"`) : { kind: "text", subject: a.subject! },
        date: a.date,
        skills: a.skills,
        featured: a.featured,
        link: a.link,
        status: a.status,
        key: keys[index]!,
        number: "",
      })),
    });
  }

  const roomById = new Map(rooms.map((r) => [r.id, r]));
  for (const event of entries.filter((e) => e.kind === "event")) {
    const work: Work = {
      id: claim(event.id),
      roomId: "",
      kind: "event",
      title: event.title,
      detail: event.detail,
      drawing: { kind: "document", tag: event.tag ?? "milestone", mark: event.mark },
      date: event.date,
      skills: event.skills,
      featured: event.featured,
      link: event.link,
      key: event.date.time,
      number: "",
    };
    if (event.on) {
      const room = roomById.get(event.on) ?? fail(`event "${event.id}" is on unknown span "${event.on}"`);
      room.works.push({ ...work, roomId: room.id });
      continue;
    }
    // An event outside any role hangs in a room named for its org, shared with its org's other events.
    const roomId = event.org ? slug(event.org) : event.id;
    const room =
      roomById.get(roomId) ??
      (() => {
        const created: Room = { id: claim(roomId), number: 0, paint: "stone", org: event.org ?? event.title, start: event.date, end: event.date, works: [] };
        rooms.push(created);
        roomById.set(roomId, created);
        return created;
      })();
    room.works.push({ ...work, roomId });
    room.mark ??= event.mark;
    if (event.date.time < room.start.time) room.start = event.date;
    if (event.date.time > room.end!.time) room.end = event.date;
  }

  // Walking order: current roles by tenure, then past roles, then single-event rooms, newest first.
  const rank = (room: Room) => (room.role ? (room.end ? 1 : 0) : 2);
  rooms.sort((a, b) => {
    if (rank(a) !== rank(b)) return rank(a) - rank(b);
    if (rank(a) === 0) return a.start.time - b.start.time;
    return (b.end?.time ?? now) - (a.end?.time ?? now);
  });
  rooms.forEach((room, index) => {
    room.number = index + 1;
    room.works.sort((a, b) => a.key - b.key);
    room.works.forEach((work, i) => (work.number = `${room.start.year}.${i + 1}`));
  });

  const works = rooms.flatMap((r) => r.works).sort((a, b) => a.key - b.key);
  const years = [...rooms.map((r) => r.start.year), ...works.flatMap((w) => (w.date ? [w.date.year] : []))];
  const current = rooms.some((r) => r.role && !r.end);
  const lastYear = current
    ? new Date(now).getUTCFullYear()
    : Math.max(...rooms.map((r) => r.end?.year ?? r.start.year));

  return { profile, rooms, works, firstYear: Math.min(...years), lastYear, builtAt: now };
}
