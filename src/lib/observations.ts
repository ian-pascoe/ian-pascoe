/**
 * Visitor achievements, logged as observations of the disk.
 * Progress lives only in this browser's localStorage; nothing is ever gated.
 */

export const OBSERVATIONS = [
  { id: "first-light", name: "First light", how: "Read an achievement." },
  { id: "both-bands", name: "Both bands", how: "Read achievements from both RTX and Spirit-Led Software." },
  { id: "new-angle", name: "New angle", how: "Look at the disk from another angle." },
  { id: "full-descent", name: "Full descent", how: "Reach the end of the page." },
  { id: "free-fall", name: "Free fall", how: "Watch the replay from 2019 to now." },
  { id: "the-log", name: "The log", how: "Open the printable resume." },
  { id: "lost-signal", name: "Lost signal", how: "Find the page that is missing." },
  { id: "say-hello", name: "Say hello", how: "Start an email to Ian." },
] as const;

export type ObservationId = (typeof OBSERVATIONS)[number]["id"];
export type Logged = Partial<Record<ObservationId, number>>;

export const OBSERVED_EVENT = "observations:logged";
const STORAGE_KEY = "ianpascoe.observations.v1";

export function readLog(): Logged {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    return value && typeof value === "object" ? (value as Logged) : {};
  } catch {
    return {};
  }
}

/** Logs an observation once. Returns true when this call logged it. */
export function observe(id: ObservationId): boolean {
  const log = readLog();
  if (log[id]) return false;
  log[id] = Date.now();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  } catch {
    // Storage can be unavailable (private mode, quota); the observation still shows for this visit.
  }
  window.dispatchEvent(new CustomEvent(OBSERVED_EVENT, { detail: { id } }));
  return true;
}

/** Wires `data-observe="<id>"` clicks and a page-level `data-page-observation` on <body>. */
export function wireObservations(): void {
  document.addEventListener("click", (event) => {
    const id = (event.target as Element | null)?.closest?.("[data-observe]")?.getAttribute("data-observe");
    if (id) observe(id as ObservationId);
  });
  const pageObservation = document.body.dataset.pageObservation as ObservationId | undefined;
  if (pageObservation) observe(pageObservation);
}
