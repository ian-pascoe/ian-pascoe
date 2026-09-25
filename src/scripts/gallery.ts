/**
 * The rooms' one state change is light: opening a work lights it and dims the
 * rest of its room, as a deep-linkable #hash. The floor plan follows the
 * visitor, and the guided tour walks the light through every work in time order.
 */
import { stamp } from "../lib/passport";

const OPENED_KEY = "ianpascoe.passport.opened.v1";
const works = [...document.querySelectorAll<HTMLElement>("[data-work]")];
const byId = new Map(works.map((w) => [w.dataset.work!, w]));
const tourOrder: string[] = JSON.parse(document.getElementById("tour-order")?.textContent ?? "[]");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

let lit: HTMLElement | null = null;

const opened = new Set<string>(
  (() => {
    try {
      return JSON.parse(localStorage.getItem(OPENED_KEY) ?? "[]") as string[];
    } catch {
      return [];
    }
  })(),
);

function recordOpened(work: HTMLElement): void {
  opened.add(work.dataset.work!);
  try {
    localStorage.setItem(OPENED_KEY, JSON.stringify([...opened]));
  } catch {
    // Storage can be unavailable; stamps still count for this visit.
  }
  stamp("first-look");
  const roomsOpened = new Set([...opened].flatMap((id) => byId.get(id)?.dataset.room ?? []));
  if (roomsOpened.size >= 2) stamp("two-rooms");
  const roomId = work.dataset.room;
  if (works.filter((w) => w.dataset.room === roomId).every((w) => opened.has(w.dataset.work!))) stamp("every-wall");
}

function light(id: string | null, options: { scroll?: boolean; hash?: boolean } = {}): void {
  const { scroll = false, hash = true } = options;
  if (lit) {
    lit.classList.remove("is-lit");
    lit.querySelector("[data-light]")?.setAttribute("aria-pressed", "false");
    lit.closest("[data-room-section]")?.removeAttribute("data-lit");
  }
  lit = (id && byId.get(id)) || null;
  if (lit) {
    lit.classList.add("is-lit");
    lit.querySelector("[data-light]")?.setAttribute("aria-pressed", "true");
    lit.closest("[data-room-section]")?.setAttribute("data-lit", "");
    if (scroll) lit.scrollIntoView({ block: "center", behavior: reduceMotion.matches ? "auto" : "smooth" });
    recordOpened(lit);
  }
  if (hash) history.replaceState(null, "", lit ? `#${lit.dataset.work}` : `${location.pathname}${location.search}`);
}

/* The guided tour. */
const bar = document.querySelector<HTMLElement>("[data-tour]");
const stepEl = bar?.querySelector<HTMLElement>("[data-tour-step]");
const titleEl = bar?.querySelector<HTMLElement>("[data-tour-title]");
const prevButton = bar?.querySelector<HTMLButtonElement>("[data-tour-prev]");
const nextLabel = bar?.querySelector<HTMLElement>("[data-tour-next-label]");
let step = -1;

function showStep(index: number): void {
  step = index;
  const id = tourOrder[step]!;
  const work = byId.get(id);
  light(id, { scroll: true });
  if (!work || !stepEl || !titleEl || !prevButton || !nextLabel) return;
  stepEl.textContent = `${step + 1} of ${tourOrder.length} · ${work.dataset.when}`;
  titleEl.replaceChildren(Object.assign(document.createElement("cite"), { textContent: work.dataset.title }));
  prevButton.disabled = step === 0;
  nextLabel.textContent = step === tourOrder.length - 1 ? "Finish" : "Next";
}

function startTour(): void {
  if (!bar || tourOrder.length === 0) return;
  bar.hidden = false;
  showStep(0);
  bar.querySelector<HTMLElement>("[data-tour-next]")?.focus({ preventScroll: true });
}

function endTour(finished: boolean): void {
  if (!bar || step < 0) return;
  if (finished) stamp("full-tour");
  bar.hidden = true;
  step = -1;
  light(null);
  document.querySelector<HTMLElement>("[data-tour-start]")?.focus({ preventScroll: true });
}

function advance(by: 1 | -1): void {
  if (step < 0) return;
  const next = step + by;
  if (next >= tourOrder.length) endTour(true);
  else if (next >= 0) showStep(next);
}

document.addEventListener("click", (event) => {
  const target = event.target as Element;
  const frame = target.closest<HTMLElement>("[data-light]");
  if (frame) {
    const id = frame.dataset.light!;
    light(lit?.dataset.work === id ? null : id);
    return;
  }
  const link = target.closest<HTMLAnchorElement>("[data-light-link]");
  if (link) {
    event.preventDefault();
    light(link.dataset.lightLink!, { scroll: true });
    return;
  }
  if (target.closest("[data-tour-start]")) return startTour();
  if (target.closest("[data-tour-next]")) return advance(1);
  if (target.closest("[data-tour-prev]")) return advance(-1);
  if (target.closest("[data-tour-end]")) return endTour(false);
  // Clicking the lit room's bare wall turns the light back down.
  if (lit && step < 0 && !target.closest(".work, a, button") && target.closest("[data-lit]")) light(null);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (step >= 0) endTour(false);
    else if (lit) light(null);
  } else if (step >= 0 && event.key === "ArrowRight") {
    event.preventDefault();
    advance(1);
  } else if (step >= 0 && event.key === "ArrowLeft") {
    event.preventDefault();
    advance(-1);
  }
});

const fromHash = () => {
  const id = decodeURIComponent(location.hash.slice(1));
  if (byId.has(id)) light(id, { hash: false });
};
window.addEventListener("hashchange", fromHash);
fromHash();

/* The floor plan lights the room the visitor is standing in. */
const planLinks = new Map(
  [...document.querySelectorAll<HTMLElement>("[data-plan]")].map((a) => [a.dataset.plan!, a]),
);
const sections = [...document.querySelectorAll<HTMLElement>("[data-room-section]")];
if ("IntersectionObserver" in window && sections.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const [id, link] of planLinks) {
          if (id === (entry.target as HTMLElement).dataset.roomSection) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        }
      }
    },
    { rootMargin: "-40% 0px -55% 0px" },
  );
  for (const section of sections) observer.observe(section);
}
