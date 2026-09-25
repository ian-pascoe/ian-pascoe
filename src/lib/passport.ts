/**
 * Visitor achievements, collected as stamps in a gallery passport.
 * Progress lives only in this browser's localStorage; nothing is ever gated.
 */

export const STAMPS = [
  { id: "first-look", name: "First look", how: "Open any work." },
  { id: "two-rooms", name: "Two rooms", how: "Open works in two different rooms." },
  { id: "every-wall", name: "Every wall", how: "Open every work in one room." },
  { id: "full-tour", name: "The full tour", how: "Take the tour from the first work to the last." },
  { id: "checklist", name: "The checklist", how: "Open the printable checklist of works." },
  { id: "backstage", name: "Backstage", how: "Find the room that is closed for installation." },
  { id: "say-hello", name: "Say hello", how: "Start an email to Ian." },
] as const;

export type StampId = (typeof STAMPS)[number]["id"];
export type Stamped = Partial<Record<StampId, number>>;

export const STAMP_EVENT = "passport:stamp";
const STORAGE_KEY = "ianpascoe.passport.v1";

export function readPassport(): Stamped {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    return value && typeof value === "object" ? (value as Stamped) : {};
  } catch {
    return {};
  }
}

/** Stamps the passport once per achievement. Returns true when this call stamped it. */
export function stamp(id: StampId): boolean {
  const passport = readPassport();
  if (passport[id]) return false;
  passport[id] = Date.now();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(passport));
  } catch {
    // Storage can be unavailable (private mode, quota); the stamp still shows for this visit.
  }
  window.dispatchEvent(new CustomEvent(STAMP_EVENT, { detail: { id } }));
  return true;
}

/** Wires `data-stamp="<id>"` clicks and a page-level `data-page-stamp` on <body>. */
export function wireStamps(): void {
  document.addEventListener("click", (event) => {
    const id = (event.target as Element | null)?.closest?.("[data-stamp]")?.getAttribute("data-stamp");
    if (id) stamp(id as StampId);
  });
  const pageStamp = document.body.dataset.pageStamp as StampId | undefined;
  if (pageStamp) stamp(pageStamp);
}
