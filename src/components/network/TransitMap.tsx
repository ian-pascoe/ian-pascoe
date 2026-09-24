import { For, Show, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { layoutMap, type PlacedStation } from "../../lib/map-layout";
import { PUNCHES, PUNCH_EVENT, punch, readPass, type PunchId, type PunchShape, type Punched } from "../../lib/ridepass";
import { allStations, dayCount, lineRange, type Line, type Station, type Timeline } from "../../lib/network";
import "./network.css";

const RIDE_MS = 9000;
const RIDE_STEP_MS = 900;
const TOAST_MS = 3600;

const monthYear = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
const number = new Intl.NumberFormat("en-US");

export default function TransitMap(props: { timeline: Timeline }) {
  const timeline = props.timeline;
  const layout = layoutMap(timeline);
  const stations = allStations(timeline);
  const stationById = new Map(stations.map((s) => [s.id, s]));
  const lineById = new Map(timeline.lines.map((l) => [l.id, l]));
  const firstLineId = timeline.lines[0]?.id ?? null;
  const current = timeline.lines.filter((l) => !l.end);
  const featured = stations.filter((s) => s.featured);
  const rideOrder = [...stations].sort((a, b) => a.key - b.key);

  const [selectedId, setSelectedId] = createSignal<string | null>(null);
  const [isolated, setIsolated] = createSignal<string | null>(null);
  const [clock, setClock] = createSignal<number | null>(null);
  const [today, setToday] = createSignal(timeline.builtAt);
  const [pass, setPass] = createSignal<Punched>({});
  const [toast, setToast] = createSignal<PunchId | null>(null);
  const [passOpen, setPassOpen] = createSignal(false);
  const visited = new Set<string>();
  let passSheet: HTMLDivElement | undefined;
  let mapRoot: SVGSVGElement | undefined;
  let frame = 0;
  let stepTimer = 0;
  let toastTimer = 0;

  const riding = () => clock() !== null;
  const arrived = (s: Station) => {
    const c = clock();
    return c === null || s.key <= c;
  };
  const arriving = createMemo(() => {
    const c = clock();
    if (c === null) return null;
    return rideOrder.findLast((s) => s.key <= c) ?? null;
  });
  const shown = () => (riding() ? arriving() : selectedId() ? (stationById.get(selectedId()!) ?? null) : null);
  // The origin sits on the first line, so it dims and navigates with it.
  const lineIdOf = (s: Station) => s.lineId ?? (s === timeline.origin ? firstLineId : null);
  const sequenceOf = (s: Station): Station[] => {
    const line = lineById.get(lineIdOf(s) ?? "");
    if (!line) return [s];
    return line.id === firstLineId && timeline.origin ? [timeline.origin, ...line.stations] : line.stations;
  };
  const punched = () => PUNCHES.filter((p) => pass()[p.id]).length;

  function select(id: string | null) {
    if (riding()) stopRide();
    setSelectedId(id);
    if (!id) {
      setIsolated(null);
      history.replaceState(null, "", location.pathname + location.search);
      return;
    }
    const station = stationById.get(id)!;
    setIsolated(lineIdOf(station));
    history.replaceState(null, "", `#stop-${id}`);

    visited.add(id);
    punch("first-stop");
    const lines = new Set([...visited].map((v) => stationById.get(v)?.lineId).filter(Boolean));
    if (lines.size >= 2) punch("transfer");
    if (timeline.lines.some((l) => l.stations.every((st) => visited.has(st.id)))) punch("end-of-the-line");
  }

  function step(from: Station, offset: -1 | 1, focus: boolean) {
    const sequence = sequenceOf(from);
    const next = sequence[sequence.indexOf(from) + offset];
    if (!next) return;
    select(next.id);
    if (focus) mapRoot?.querySelector<SVGElement>(`[data-stop="${next.id}"]`)?.focus();
  }

  function stopRide() {
    cancelAnimationFrame(frame);
    clearTimeout(stepTimer);
    setClock(null);
  }

  function startRide() {
    stopRide();
    setSelectedId(null);
    setIsolated(null);
    const finish = () => {
      setClock(null);
      punch("ride");
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Discrete stops, no movement.
      let index = 0;
      const next = () => {
        const station = rideOrder[index++];
        if (!station) return finish();
        setClock(station.key);
        stepTimer = window.setTimeout(next, RIDE_STEP_MS);
      };
      next();
      return;
    }
    const began = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - began) / RIDE_MS);
      setClock(layout.start + (layout.end - layout.start) * progress);
      if (progress < 1) frame = requestAnimationFrame(tick);
      else finish();
    };
    frame = requestAnimationFrame(tick);
  }

  onMount(() => {
    setToday(Date.now());
    setPass(readPass());

    const fromHash = decodeURIComponent(location.hash).replace(/^#stop-/, "");
    if (fromHash !== location.hash && stationById.has(fromHash)) select(fromHash);

    const onPunch = (event: Event) => {
      setPass(readPass());
      setToast((event as CustomEvent<{ id: PunchId }>).detail.id);
      clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => setToast(null), TOAST_MS);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || passOpen()) return;
      if (riding()) stopRide();
      else if (selectedId() || isolated()) select(null);
    };
    window.addEventListener(PUNCH_EVENT, onPunch);
    document.addEventListener("keydown", onKey);
    onCleanup(() => {
      window.removeEventListener(PUNCH_EVENT, onPunch);
      document.removeEventListener("keydown", onKey);
      stopRide();
      clearTimeout(toastTimer);
    });
  });

  const togglePass = () => {
    if (!passSheet) return;
    if (passOpen()) passSheet.hidePopover();
    else passSheet.showPopover();
  };

  const StopMark = (p: { placed: PlacedStation }) => {
    const s = p.placed.station;
    const above = p.placed.labelSide === "above";
    const lx = p.placed.x + 12;
    const ly = p.placed.y + (above ? -12 : 12);
    const radius = s.featured || s.kind !== "achievement" ? 8.5 : 7;
    const dim = () => isolated() !== null && lineIdOf(s) !== isolated();
    return (
      <g
        class="stop"
        classList={{
          "is-selected": shown() === s,
          "is-dim": dim(),
          "is-featured": s.featured,
          "is-pending": !arrived(s),
          "is-terminal": s.kind !== "achievement",
          "is-below": !above,
        }}
      >
        <a
          href={`#stop-${s.id}`}
          data-stop={s.id}
          aria-label={s.label === s.name ? s.label : `${s.label}: ${s.name}`}
          aria-current={shown() === s ? "true" : undefined}
          onClick={(event) => {
            event.preventDefault();
            select(s.id);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
              event.preventDefault();
              step(s, event.key === "ArrowRight" ? 1 : -1, true);
            }
          }}
        >
          <circle class="stop__hit" cx={p.placed.x} cy={p.placed.y} r={22} />
          <circle class="stop__halo" cx={p.placed.x} cy={p.placed.y} r={radius + 9} />
          <circle class="stop__dot" cx={p.placed.x} cy={p.placed.y} r={radius} />
          <text class="stop__label" x={lx} y={ly} transform={`rotate(${above ? -45 : 45} ${lx} ${ly})`}>
            {s.label}
          </text>
        </a>
      </g>
    );
  };

  const trainAt = (points: [number, number][], x: number): [number, number] | null => {
    for (let i = 0; i < points.length - 1; i++) {
      const [x1, y1] = points[i]!;
      const [x2, y2] = points[i + 1]!;
      if (x >= x1 && x <= x2) return [x, x2 === x1 ? y2 : y1 + ((y2 - y1) * (x - x1)) / (x2 - x1)];
    }
    return null;
  };

  const rideX = () => {
    const c = clock();
    return c === null ? layout.width : layout.xAt(c);
  };

  return (
    <section class="network" aria-labelledby="network-title">
      <div class="network__bar wrap">
        <div class="network__heading">
          <h2 id="network-title" class="network__title">
            Network map
          </h2>
          <p class="network__note">Diagram not to scale. Select a station for the story behind it.</p>
        </div>
        <div class="network__controls">
          <ul class="line-keys" role="list" aria-label="Isolate a line">
            <For each={timeline.lines}>
              {(line) => (
                <li>
                  <button
                    type="button"
                    class="line-key"
                    data-color={line.color}
                    aria-pressed={isolated() === line.id && !selectedId()}
                    onClick={() => {
                      const on = isolated() === line.id && !selectedId();
                      select(null);
                      if (!on) setIsolated(line.id);
                    }}
                  >
                    <span class="bullet" aria-hidden="true">
                      {line.code}
                    </span>
                    {line.org.replace(/ LLC$/, "")}
                  </button>
                </li>
              )}
            </For>
          </ul>
          <button type="button" class="ride-button" onClick={() => (riding() ? stopRide() : startRide())}>
            <Icon name={riding() ? "stop" : "play"} />
            {riding() ? "Stop the ride" : `Ride from ${new Date(layout.start).getUTCFullYear()}`}
          </button>
        </div>
      </div>

      <div class="network__map wrap">
        <svg
          ref={mapRoot}
          class="map"
          classList={{ "is-riding": riding() }}
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          role="group"
          aria-labelledby="network-title"
        >
          <clipPath id="ride-clip">
            <rect x="0" y="0" width={rideX()} height={layout.height} />
          </clipPath>
          <g clip-path="url(#ride-clip)">
            <For each={layout.lines}>
              {(placed) => (
                <path
                  class="track"
                  classList={{ "is-dim": isolated() !== null && isolated() !== placed.line.id }}
                  data-color={placed.line.color}
                  d={placed.path}
                />
              )}
            </For>
          </g>

          <Show when={layout.now}>
            {(now) => (
              <g class="now" classList={{ "is-pending": riding() }}>
                <rect
                  class="now__capsule"
                  x={now().x - 14}
                  y={now().top}
                  width="28"
                  height={now().bottom - now().top}
                  rx="14"
                />
                <text class="now__label" x={now().x + 26} y={now().top + 16}>
                  Now
                </text>
                <text class="now__date" x={now().x + 26} y={now().top + 40}>
                  {monthYear.format(today())}
                </text>
              </g>
            )}
          </Show>

          {/* Cursor and trains sit under the stations so they never cover a label. */}
          <Show when={clock() !== null}>
            <g class="ride-cursor" aria-hidden="true">
              <line x1={rideX()} x2={rideX()} y1="30" y2={layout.height - 12} />
              <For each={layout.lines}>
                {(placed) => {
                  const at = () => trainAt(placed.points, rideX());
                  return (
                    <Show when={at()}>
                      {(point) => (
                        <circle class="train" data-color={placed.line.color} cx={point()[0]} cy={point()[1]} r="9" />
                      )}
                    </Show>
                  );
                }}
              </For>
            </g>
          </Show>

          <Show when={layout.origin}>{(origin) => <StopMark placed={origin()} />}</Show>
          <For each={layout.lines}>
            {(placed) => (
              <g data-color={placed.line.color}>
                <For each={placed.stations}>{(stop) => <StopMark placed={stop} />}</For>
              </g>
            )}
          </For>

          <Show when={clock() !== null}>
            <text class="ride-year" x={rideX() + 8} y="22" aria-hidden="true">
              {new Date(clock()!).getUTCFullYear()}
            </text>
          </Show>
        </svg>
      </div>

      <div class="network__strip wrap">
        <p class="visually-hidden" role="status">
          {riding() && arriving() ? `Arriving: ${arriving()!.name}` : ""}
        </p>
        <div class="station" aria-live={riding() ? "off" : "polite"}>
          <Show
            when={shown()}
            fallback={
              <NowCard current={current} featured={featured} today={today()} lineById={lineById} onSelect={select} />
            }
          >
            {(station) => (
              <StationCard
                station={station()}
                line={lineById.get(lineIdOf(station()) ?? "")}
                sequence={sequenceOf(station())}
                riding={riding()}
                onStep={(offset) => step(station(), offset, false)}
                onClose={() => select(null)}
              />
            )}
          </Show>
        </div>

        <div class="pass">
          <span class="pass__lift">
            <button
              type="button"
              class="pass-ticket"
              aria-expanded={passOpen()}
              aria-controls="ride-pass"
              onClick={togglePass}
            >
              <span class="pass-ticket__band">
                <span>Ride pass</span>
                <span class="data">
                  {punched()}/{PUNCHES.length}
                </span>
              </span>
              <span class="pass-ticket__holes" aria-hidden="true">
                <For each={PUNCHES}>{(p) => <PunchMark shape={p.shape} punched={!!pass()[p.id]} />}</For>
              </span>
              <span class="pass-ticket__hint">See what earns a punch</span>
            </button>
          </span>
        </div>
      </div>

      <div
        id="ride-pass"
        class="pass-sheet"
        ref={passSheet}
        {...{ popover: "auto" }}
        aria-labelledby="ride-pass-title"
        onToggle={(event: ToggleEvent) => setPassOpen(event.newState === "open")}
      >
        <div class="pass-sheet__band">
          <h2 id="ride-pass-title">Ride pass</h2>
          <span class="data">
            {punched()} of {PUNCHES.length} punched
          </span>
        </div>
        <p class="pass-sheet__lede">
          Small rewards for exploring. Everything on the site is open to you either way, and your punches stay in this
          browser.
        </p>
        <ol class="pass-sheet__list" role="list">
          <For each={PUNCHES}>
            {(p) => (
              <li classList={{ "is-punched": !!pass()[p.id] }}>
                <PunchMark shape={p.shape} punched={!!pass()[p.id]} />
                <span>
                  <strong>{p.name}</strong>
                  <span>{p.how}</span>
                </span>
                <span class="visually-hidden">{pass()[p.id] ? "Punched" : "Not punched yet"}</span>
              </li>
            )}
          </For>
        </ol>
        <div class="pass-sheet__foot">
          <button type="button" class="pass-sheet__close" onClick={() => passSheet?.hidePopover()}>
            <Icon name="close" />
            Close
          </button>
        </div>
      </div>

      <div class="punch-toast" classList={{ "is-shown": toast() !== null }} role="status">
        <Show when={toast()}>
          {(id) => {
            const p = PUNCHES.find((x) => x.id === id())!;
            return (
              <>
                <PunchMark shape={p.shape} punched />
                <span>
                  Ticket punched: <strong>{p.name}</strong>
                </span>
              </>
            );
          }}
        </Show>
      </div>
    </section>
  );
}

function NowCard(props: {
  current: Line[];
  featured: Station[];
  today: number;
  lineById: Map<string, Line>;
  onSelect: (id: string) => void;
}) {
  return (
    <article class="station__card is-now">
      {/* On phones this rail turns the Now card into the top of the vertical strip map. */}
      <div class="now-rail" aria-hidden="true">
        <span class="now-rail__capsule" />
        <span class="now-rail__lines">
          <For each={props.current}>{(line) => <span class="now-rail__line" data-color={line.color} />}</For>
        </span>
      </div>
      <div class="station__figure">
        <h3 class="station__metric">Now</h3>
        <p class="station__metric-label">{monthYear.format(props.today)}</p>
      </div>
      <div class="station__body">
        <ul class="now-lines" role="list">
          <For each={props.current}>
            {(line) => (
              <li data-color={line.color}>
                <span class="bullet" aria-hidden="true">
                  {line.code}
                </span>
                <span class="now-lines__what">
                  <strong>{line.title}</strong>, {line.org}
                </span>
                <span class="now-lines__days data">
                  Day {number.format(dayCount(line.start.time, props.today))}
                </span>
              </li>
            )}
          </For>
        </ul>
        <Show when={props.featured.length}>
          <h4 class="featured__title">Featured stops</h4>
          <ul class="featured" role="list">
            <For each={props.featured}>
              {(s) => (
                <li>
                  <a
                    class="featured__stop"
                    href={`#stop-${s.id}`}
                    data-color={props.lineById.get(s.lineId ?? "")?.color}
                    onClick={(event) => {
                      event.preventDefault();
                      props.onSelect(s.id);
                    }}
                  >
                    <span class="bullet" aria-hidden="true">
                      {props.lineById.get(s.lineId ?? "")?.code}
                    </span>
                    <span class="featured__label">{s.name}</span>
                    <Show when={s.metric}>
                      <span class="featured__metric">{s.metric}</span>
                    </Show>
                  </a>
                </li>
              )}
            </For>
          </ul>
        </Show>
      </div>
    </article>
  );
}

function StationCard(props: {
  station: Station;
  line: Line | undefined;
  sequence: Station[];
  riding: boolean;
  onStep: (offset: -1 | 1) => void;
  onClose: () => void;
}) {
  const s = () => props.station;
  const index = () => props.sequence.indexOf(s());
  return (
    <article class="station__card" data-color={props.line?.color}>
      <div class="station__figure">
        <Show
          when={s().metric}
          fallback={
            <Show
              when={s().date}
              fallback={
                <span class="bullet bullet--figure" aria-hidden="true">
                  {props.line?.code}
                </span>
              }
            >
              {(date) => <span class="station__metric station__metric--date">{date().label}</span>}
            </Show>
          }
        >
          <span class="station__metric">{s().metric}</span>
          <span class="station__metric-label">{s().metricLabel}</span>
        </Show>
      </div>
      <div class="station__body">
        <h3 class="station__name">{s().name}</h3>
        <p class="station__meta">
          <Show when={props.line}>
            {(line) => (
              <span class="bullet bullet--small" aria-hidden="true">
                {line().code}
              </span>
            )}
          </Show>
          <span class="station__where">
            <span>{s().org ?? props.line?.org}</span>
            <span class="data">{s().date ? s().date!.label : props.line ? lineRange(props.line) : ""}</span>
          </span>
        </p>
        <p class="station__detail">{s().detail}</p>
        <Show when={s().skills.length || s().link}>
          <div class="station__extras">
            <Show when={s().skills.length}>
              <ul class="tags" role="list" aria-label="Skills">
                <For each={s().skills}>{(skill) => <li class="tag">{skill}</li>}</For>
              </ul>
            </Show>
            <Show when={s().link}>
              {(link) => (
                <a class="station__link" href={link().href} rel="noopener">
                  {link().label}
                  <Icon name="external" />
                </a>
              )}
            </Show>
          </div>
        </Show>
      </div>
      <Show when={!props.riding}>
        <nav class="station__nav" aria-label="Stops on this line">
          <button type="button" onClick={() => props.onStep(-1)} disabled={index() <= 0}>
            <Icon name="left" />
            Previous stop
          </button>
          <button type="button" onClick={() => props.onStep(1)} disabled={index() >= props.sequence.length - 1}>
            Next stop
            <Icon name="right" />
          </button>
          <button type="button" class="station__close" onClick={props.onClose}>
            Back to now
          </button>
        </nav>
      </Show>
    </article>
  );
}

const PUNCH_PATHS: Record<PunchShape, string> = {
  circle: "M10 3.5a6.5 6.5 0 1 1 0 13a6.5 6.5 0 1 1 0-13Z",
  diamond: "M10 2.5 17.5 10 10 17.5 2.5 10Z",
  square: "M4 4h12v12H4Z",
  star: "M10 2.2l2.3 5 5.4.5-4.1 3.6 1.2 5.3L10 13.9l-4.8 2.7 1.2-5.3-4.1-3.6 5.4-.5Z",
  triangle: "M10 2.8 17.6 16.4H2.4Z",
  cross: "M7.5 2.8h5v4.7h4.7v5h-4.7v4.7h-5v-4.7H2.8v-5h4.7Z",
  hexagon: "M10 2.5 16.5 6.25v7.5L10 17.5 3.5 13.75v-7.5Z",
};

function PunchMark(props: { shape: PunchShape; punched: boolean }) {
  return (
    <svg class="punch" classList={{ "is-punched": props.punched }} viewBox="0 0 20 20" aria-hidden="true">
      <path d={PUNCH_PATHS[props.shape]} />
    </svg>
  );
}

const ICONS = {
  play: { d: "M7 5.5v13l11-6.5Z", filled: true },
  stop: { d: "M6.5 6.5h11v11h-11Z", filled: true },
  left: { d: "M14.5 6 8.5 12l6 6", filled: false },
  right: { d: "m9.5 6 6 6-6 6", filled: false },
  close: { d: "M6.5 6.5l11 11m0-11-11 11", filled: false },
  external: { d: "M9 6h9v9M18 6 7 17", filled: false },
};

function Icon(props: { name: keyof typeof ICONS }) {
  return (
    <svg
      class="icon"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path
        d={ICONS[props.name].d}
        fill={ICONS[props.name].filled ? "currentColor" : "none"}
        stroke={ICONS[props.name].filled ? "none" : "currentColor"}
      />
    </svg>
  );
}
