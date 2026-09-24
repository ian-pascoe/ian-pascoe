/**
 * Visitor achievements, collected as punches on a ride pass.
 * Progress lives only in this browser's localStorage; nothing is ever gated.
 */

export const PUNCHES = [
  { id: "first-stop", name: "First stop", how: "Open any station on the map.", shape: "circle" },
  { id: "transfer", name: "Transfer", how: "Open stations on two different lines.", shape: "diamond" },
  { id: "end-of-the-line", name: "End of the line", how: "Open every station on one line.", shape: "square" },
  { id: "ride", name: "Rode from 2019", how: "Ride the network from 2019 to now, or scroll the timetable to its origin.", shape: "star" },
  { id: "timetable", name: "Timetable", how: "Open the printable resume.", shape: "triangle" },
  { id: "off-the-map", name: "Off the map", how: "Find a station that isn't on the map.", shape: "cross" },
  { id: "say-hello", name: "Say hello", how: "Start an email to Ian.", shape: "hexagon" },
] as const;

export type PunchId = (typeof PUNCHES)[number]["id"];
export type PunchShape = (typeof PUNCHES)[number]["shape"];
export type Punched = Partial<Record<PunchId, number>>;

export const PUNCH_EVENT = "ride-pass:punch";
const STORAGE_KEY = "ianpascoe.ride-pass.v1";

export function readPass(): Punched {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    return value && typeof value === "object" ? (value as Punched) : {};
  } catch {
    return {};
  }
}

/** Punches the pass once per achievement. Returns true when this call punched it. */
export function punch(id: PunchId): boolean {
  const pass = readPass();
  if (pass[id]) return false;
  pass[id] = Date.now();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pass));
  } catch {
    // Storage can be unavailable (private mode, quota); the punch still shows for this visit.
  }
  window.dispatchEvent(new CustomEvent(PUNCH_EVENT, { detail: { id } }));
  return true;
}

/** Wires `data-punch="<id>"` clicks and a page-level `data-page-punch` on <body>. */
export function wirePunches(root: ParentNode = document): void {
  root.addEventListener("click", (event) => {
    const target = (event.target as Element | null)?.closest?.("[data-punch]");
    const id = target?.getAttribute("data-punch") as PunchId | null;
    if (id) punch(id);
  });
  const pagePunch = document.body.dataset.pagePunch as PunchId | undefined;
  if (pagePunch) punch(pagePunch);

  const origin = document.querySelector("[data-origin-stop]");
  if (origin && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        punch("ride");
        observer.disconnect();
      }
    });
    observer.observe(origin);
  }
}
