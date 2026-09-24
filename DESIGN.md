---
name: Ian Pascoe
description: A career drawn as a flat, Unimark-era subway diagram on paper-white map stock.
colors:
  paper: "oklch(98.6% 0.002 100)"
  paper-sunk: "oklch(95.8% 0.003 100)"
  ink: "oklch(18% 0.004 100)"
  ink-soft: "oklch(38% 0.006 100)"
  ink-quiet: "oklch(50% 0.006 100)"
  rule: "oklch(86% 0.004 100)"
  sign: "oklch(16.5% 0.003 100)"
  sign-ink: "oklch(99% 0 0)"
  sign-ink-soft: "oklch(84% 0.004 100)"
  station-white: "#ffffff"
  info: "#fccc0a"
  info-ink: "oklch(18% 0.004 100)"
  line-red: "#e8322b"
  line-blue: "#0039a6"
  line-green: "#00873b"
  line-orange: "#f25c19"
  line-purple: "#a52fa0"
  line-brown: "#8f5f2f"
  line-teal: "#00829a"
typography:
  display:
    fontFamily: "Overpass Variable, Overpass, sans-serif"
    fontSize: "clamp(2.5rem, 1.6rem + 3.4vw, 4.75rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  metric:
    fontFamily: "Overpass Variable, Overpass, sans-serif"
    fontSize: "clamp(3.5rem, 2rem + 3.6vw, 5.75rem)"
    fontWeight: 800
    lineHeight: 0.88
    letterSpacing: "-0.035em"
    fontFeature: "tnum"
  headline:
    fontFamily: "Overpass Variable, Overpass, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  title-lg:
    fontFamily: "Overpass Variable, Overpass, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Overpass Variable, Overpass, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    lineHeight: 1.25
  body-lead:
    fontFamily: "Overpass Variable, Overpass, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.45
  body:
    fontFamily: "Overpass Variable, Overpass, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Overpass Variable, Overpass, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.4
  map-label:
    fontFamily: "Overpass Variable, Overpass, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    letterSpacing: "0"
  data:
    fontFamily: "Overpass Mono Variable, Overpass Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    letterSpacing: "0"
    fontFeature: "tnum"
rounded:
  sign: "0.25rem"
  capsule: "999px"
  round: "50%"
spacing:
  space-1: "0.25rem"
  space-2: "0.5rem"
  space-3: "0.75rem"
  space-4: "1rem"
  space-5: "1.5rem"
  space-6: "2rem"
  space-7: "3rem"
  space-8: "4.5rem"
  space-9: "7rem"
components:
  sign-band:
    backgroundColor: "{colors.sign}"
    textColor: "{colors.sign-ink}"
    typography: "{typography.display}"
    padding: "2rem 0 1.5rem"
  info-sign:
    backgroundColor: "{colors.info}"
    textColor: "{colors.info-ink}"
    rounded: "{rounded.sign}"
    padding: "0.7rem 1.25rem 0.6rem"
    height: "3rem"
  info-sign-hover:
    backgroundColor: "color-mix(in oklch, #fccc0a 86%, white)"
    textColor: "{colors.info-ink}"
  route-bullet:
    backgroundColor: "{colors.line-red}"
    textColor: "{colors.station-white}"
    rounded: "{rounded.round}"
    size: "2.25rem"
  line-key:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.capsule}"
    padding: "0.3rem 1rem 0.3rem 0.35rem"
    height: "2.75rem"
  line-key-hover:
    backgroundColor: "{colors.paper-sunk}"
    textColor: "{colors.ink}"
  line-key-pressed:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  sign-button:
    backgroundColor: "{colors.sign}"
    textColor: "{colors.sign-ink}"
    rounded: "{rounded.sign}"
    padding: "0.5rem 1.15rem 0.45rem 0.9rem"
    height: "2.75rem"
  sign-button-hover:
    backgroundColor: "oklch(28% 0.004 100)"
    textColor: "{colors.sign-ink}"
  outline-button:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sign}"
    padding: "0.45rem 0.9rem 0.4rem"
    height: "2.75rem"
  outline-button-hover:
    backgroundColor: "{colors.paper-sunk}"
    textColor: "{colors.ink}"
  outline-button-disabled:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-quiet}"
  featured-stop:
    backgroundColor: "{colors.station-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sign}"
    padding: "0.35rem 0.9rem 0.35rem 0.4rem"
    height: "2.75rem"
  tag:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.capsule}"
    padding: "0.2rem 0.55rem 0.1rem"
  pass-ticket:
    backgroundColor: "{colors.station-white}"
    textColor: "{colors.ink}"
    width: "15.5rem"
  pass-ticket-band:
    backgroundColor: "{colors.sign}"
    textColor: "{colors.sign-ink}"
    padding: "0.6rem 1rem 0.45rem"
  punch-toast:
    backgroundColor: "{colors.sign}"
    textColor: "{colors.sign-ink}"
    padding: "0.75rem 1.2rem 0.65rem 0.9rem"
---

# Design System: Ian Pascoe

## Overview

**Creative North Star: "The Career Transit Map"**

The site is a transit authority's printed network map for one person's career. Roles are colored lines, dated achievements are stations, and the present is a capsule interchange where every current line meets. Everything is flat ink on paper-white map stock, lettered in a single grotesque, the way Unimark-era subway signage was: black station-sign bands with a thin white rule, round route bullets, thick tracks with 45° bends, white stations ringed in black.

Density is that of a good wayfinding system: generous white ground around a small number of very legible, very heavy marks. Hierarchy comes from weight (800 for every name and number), size, and thick black rules, never from tint, texture or depth. The one lifted object in the world is the ride-pass ticket; the one warm color outside the lines is information yellow on the contact sign.

Motion belongs to the diagram. There is one authored sequence, the ride replay that redraws the network in time order, and it only runs when asked. Everything else is a short ease-out state change. Nothing moves or sounds on its own.

**Key Characteristics:**
- Paper-white ground, signage-black bands and rules, pure white station discs.
- Seven reserved line colors, applied only to routes through a `data-color` hook.
- One family, Overpass, set heavy; Overpass Mono only for clocks: dates, day counters, the ride year, the pass tally.
- Circles, capsules and 4px sign corners; 45° diagonals in the diagram and its labels.
- Flat everywhere except the ride-pass ticket's lift.
- Desktop draws a horizontal network diagram; below 60rem the same data becomes a vertical strip map.

## Colors

Neutral paper and signage black carry the page; saturated transit hues are reserved for lines, and a single yellow marks the way to contact.

### Primary
- **Signage Black** (`sign`): the station-sign bands (header, contact footer, 404 sign), the ride button, the ticket and sheet bands, the punch toast. Near-black with a whisper of warmth; it is the brand surface.
- **Information Yellow** (`info`): the "Email Ian" sign in the header and the large email sign in the footer. Set with `info-ink` lettering.

### Secondary
- **Line Red** (`line-red`), **Line Blue** (`line-blue`), **Line Green** (`line-green`), **Line Orange** (`line-orange`), **Line Purple** (`line-purple`), **Line Brown** (`line-brown`), **Line Teal** (`line-teal`): the route palette. Each line in the timeline data names one color; `[data-color]` maps it to `--line-color` and `--bullet-color`, which feed tracks, route bullets, timetable strip bars, the mobile Now rail, and the ride train. The current data uses red (RTX) and blue (Spirit-Led Software).

### Neutral
- **Map Paper** (`paper`): page ground, line-key and outline-button fill, halo stroke behind SVG labels.
- **Sunk Paper** (`paper-sunk`): hover fill for keys, buttons and featured stops; station-dot hover; `:target` highlight pad.
- **Station White** (`station-white`): station discs, the Now capsule, the ride-pass ticket and sheet, featured-stop tiles, resume sheet, route-bullet lettering. Brighter than the paper, so stations read as punched-out white.
- **Ink** (`ink`): body text, 4px section rules, station rings, button and key borders, focus outline.
- **Soft Ink** (`ink-soft`): secondary lines (headline on paper, summaries, metric labels, dates, day counters).
- **Quiet Ink** (`ink-quiet`): tertiary notes, disabled text, dotted index leaders, unpunched punch outlines.
- **Rule Grey** (`rule`): 1px hairlines between list rows and in the pass sheet; disabled button border.
- **Sign White** (`sign-ink`) and **Sign White Soft** (`sign-ink-soft`): lettering and the thin top rule on black signs; secondary sign copy.

### Named Rules
**The Information Yellow Rule.** Yellow is the contact sign. The only content surface it fills is the email action; beyond that it appears only in system states (text selection, the skip link, the focus ring on black signs). Never use it for a highlight, badge, chart or decoration.

**The Lines Are Lines Rule.** A line color only ever paints a route: a track, a route bullet, a strip-map bar, the train. Never set text, a background panel, a border or a hover state in a line color.

**The Flat Ink Rule.** Color is applied as flat, opaque fills. No gradients, glows, glass or tinted overlays. Dimming is done by mixing a line toward paper (16%) or dropping a station to 28% opacity.

## Typography

**Display Font:** Overpass Variable (with Overpass, sans-serif), self-hosted via `@fontsource-variable/overpass`
**Body Font:** Overpass Variable, the same family
**Label/Mono Font:** Overpass Mono Variable (with Overpass Mono, ui-monospace, monospace), via `@fontsource-variable/overpass-mono`

**Character:** Overpass descends from Highway Gothic, so the whole site reads as sign lettering: heavy, open, slightly condensed. The mono is its clock: it appears only where a number ticks or a date stamps.

### Hierarchy
- **Display** (800, `--step-4` clamp 2.5–4.75rem, 0.95): the name on the station sign, "Say hello" in the footer, "Station closed" on the 404.
- **Metric** (800, clamp 3.5–5.75rem, 0.88, tabular): the figure in the station strip ("−75%", "Now"). A date-only figure steps down to clamp 2.5–3.75rem.
- **Headline** (800, `--step-3` 2.25rem, 1.05): section heads (Timetable, Index of skills), timetable line names, station names, inline timetable metrics.
- **Title Large** (800, `--step-2` 1.625rem): the "Network map" bar title, pass-sheet title, origin station, 404 lede (700).
- **Title** (800, `--step-1` 1.25rem, 1.25): timetable stop names.
- **Body Lead** (400, `--step-1`, 1.45, max 62ch): station detail sentence; sign headline (500).
- **Body** (400, `--step-0` 1.0625rem, 1.5, max 66ch): summaries, stop details, running text.
- **Label** (600–700, `--step--1` 0.875rem): keys, outline buttons, tags, notes.
- **Map Label** (600, 15px; 800 when featured or selected): SVG station names, rotated ±45°, with a 5px paper halo stroke.
- **Data** (Overpass Mono 500, tabular-nums, letter-spacing 0): `<time>` and `.data` only.

Scale steps: `--step--1` 0.875rem, `--step-0` 1.0625rem, `--step-1` 1.25rem, `--step-2` 1.625rem, `--step-3` 2.25rem, `--step-4` fluid. Headings 1–3 get `letter-spacing: -0.02em` and `text-wrap: balance`; paragraphs `text-wrap: pretty`.

### Named Rules
**The Mono Is a Clock Rule.** Overpass Mono sets dates, live day counters, the ride year and the pass tally. Every other string, including large metrics, is Overpass with tabular numerals.

**The Metric Outranks Its Sentence Rule.** Where a stop has a number, the number is the largest thing in its block (Metric in the strip, Headline in the timetable) and the sentence sits under it at Body size.

**The One Weight for Names Rule.** Names of people, places, lines and stations are 800. Weight 400 is for sentences only.

## Layout

A single centered column (`.wrap`, max `88rem`) with a fluid gutter (`clamp(1.25rem, 0.6rem + 2.8vw, 3rem)`). Full-bleed black sign bands open and close the page; everything between sits on paper.

Page order: station sign → network bar (title, line keys, ride button) → diagram → station strip (grid: card + ride-pass column) → Timetable → Index of skills → contact sign. Sections open with a heading row over a 4px ink rule; section tops use `--space-9` (7rem) for Timetable and `--space-8` for the index.

The spacing scale is `--space-1` through `--space-9` (0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4.5, 7rem). Component gaps sit at 2–5; section breathing at 7–9.

Responsive behavior:
- **≤60rem:** the SVG diagram and its controls hide; the Now card becomes the head of a vertical strip map (a capsule with the current lines hanging down its left edge); the station card collapses to one column; the ride pass spans full width and its sheet docks to the bottom edge. The sign band drops the actions under the name.
- **≤40rem:** timetable rows collapse from `7.5rem | 2.75rem | 1fr` (date | strip | content) to `2.25rem | 1fr`, dates moving above the stop.
- **≤36rem:** the sign band stacks fully and the yellow sign stretches to full width.

The skill index flows in CSS columns (`columns: 3 18rem`) with dotted leaders between skill and stops, like a map's street index.

## Elevation & Depth

The world is flat. Depth is conveyed by ink weight, the black-on-paper sign bands, and white stations standing on colored tracks. There is exactly one lifted object: the ride-pass ticket, which hangs off the page like a paper pass.

### Shadow Vocabulary
- **Ticket lift** (`filter: drop-shadow(0 1px 1px oklch(0% 0 0 / 0.14)) drop-shadow(0 10px 14px oklch(0% 0 0 / 0.14))`): the ride-pass ticket only. A drop-shadow filter so it follows the punched notches.
- **Sheet scrim** (`::backdrop` `oklch(18% 0.004 100 / 0.28)`): the modal ride-pass sheet dims the page flatly; the sheet itself carries a 3px white border, not a shadow.

### Named Rules
**The One Ticket Rule.** Only the ride-pass ticket casts a shadow. Cards, strips, buttons, the sheet and the toast are flat.

## Shapes

Three corner values, each tied to a real transit object:
- **Round** (50%): route bullets, stations, the portrait medallion, the 404 code disc, punch "circle".
- **Capsule** (999px): the Now interchange, line keys, skill tags, the mobile Now rail head.
- **Sign corner** (0.25rem): the yellow info sign, ride and print buttons, outline buttons, featured-stop tiles.

Everything else is square: bands, rules, the ticket and sheet bodies. The ticket is clipped by a mask with two 0.6rem semicircle notches at 62% height, like a tear-off pass.

In the diagram, tracks are 11px strokes with round joins; a line leaves its row and joins the Now row on a true 45° diagonal (horizontal run equals vertical drop). Station labels rotate ±45°. Strip-map bars are 10px (timetable) and 9px (mobile Now rail). Rules are 4px ink for section heads and the station strip, 1–1.5px for row hairlines.

## Components

### Station Sign Band
Black full-bleed band with a 2px white rule set 0.5rem below its top edge, as on a platform sign. Holds the round portrait (4px white ring), the Display name, the headline in soft white, the route bullets of current lines, location, and the contact actions. The contact footer and the 404 page reuse the same band.

### Information Sign (contact)
- **Shape:** sign corner (0.25rem), min-height 3rem, icon + label, weight 800 at `--step-1`.
- **Color:** yellow fill, ink lettering. Footer variant scales type to clamp 1.25–2.25rem with 1rem × 1.5rem padding.
- **Hover:** fill mixes 14% toward white over 160ms.

### Route Bullet
A filled circle in the line color with the line's letter in white 800 at 56% of the diameter. Size is set by `--size`: 2.25rem default, 2.75rem timetable head, 5rem station figure, 1.9rem in keys, 1.75rem featured, 1.5rem meta, 1.35rem index, 1.6rem resume. Sign bullets scale to 1.08 on hover.

### Buttons
- **Ride / Print (sign button):** black fill, white 800 text, 0.25rem corners, min-height 2.75rem, inline SVG icon; hover lifts to `oklch(28% 0.004 100)`.
- **Outline button (station nav, pass close):** paper fill, 2px ink border, 0.25rem corners, Label type; hover fills sunk paper; disabled switches to rule border and quiet text. The "close" variant is a borderless underlined text button.
- **Line key (toggle):** capsule with 2px ink border holding a bullet and the org name; `aria-pressed="true"` inverts to ink fill with paper text. Isolates that line on the map.

### Network Diagram
- **Tracks:** 11px strokes in `--line-color`, round joins, 45° merges; dimmed lines mix to 16% color over paper.
- **Stations:** white discs with a 3.5px ink ring (4.5px for featured and terminal). Hover fills sunk paper; focus shows a dashed ink halo; selected fills ink, grows to r 11px with a solid halo at r 19px, and its label slides 8px out along the 45° axis.
- **Now interchange:** a white capsule with a 4.5px ink ring where current lines terminate, labeled "Now" at 26px 800 with a mono date.
- **Ride replay:** a dashed 1.5px ink cursor sweeps left to right with the year in mono 18px; a train (line-colored disc, ink ring) rides each line; stations pop in with a 420ms scale-from-0.2 "arrive".

### Station Strip
Opens under a 4px ink rule. Three columns: the metric-first figure (Metric type over a soft label, or a 5rem route bullet), then name (Headline), line/date meta, the detail sentence (Body Lead) and tags/links, then Previous/Next/Close outline buttons. By default it shows the Now card: current lines as rows with live mono day counters, then featured-stop tiles (white, 2px ink border, bullet + metric + name).

### Timetable (vertical strip map)
Each line opens with a bullet, org name, role · range · live day count, and summary. Its stops hang on one continuous 10px bar in the line color, each marked by a 1.25rem white disc with a 3.5px ink ring; dates right-align in mono to the left of the bar. The origin station below uses a larger 1.6rem disc with a 5px ring. A `:target` stop name gets a flat sunk-paper pad.

### Index of Skills
A three-column map index: skill in 800, a 2px dotted quiet-ink leader, then right-aligned stops each with a 1.35rem bullet.

### Tags
Capsules with a 1.5px ink border, Label type at 600, no fill.

### Ride Pass (ticket, sheet, punches, toast)
- **Ticket:** 15.5rem white pass with a black band (title + mono tally), a row of seven conductor punches, and an underlined hint; the only shadowed element. Hover nudges it up 2px and −0.6°.
- **Punches:** 1.4rem shapes (circle, diamond, square, star, triangle, cross, hexagon) drawn as dashed 1.4px quiet-ink outlines; punched ones fill solid ink.
- **Sheet:** a modal `<dialog>` pulled from the ticket's corner (bottom-right; bottom sheet on mobile), white with a 3px white border, black band header, hairline-ruled punch list, sticky footer with the Close button.
- **Toast:** black band with a 2px white border, slides up 1rem and fades in on a new punch, holds 3.6s.

### Links and Focus
Text links inherit color, underline at 0.08em thickness (0.14em on hover), 0.2em offset. On black signs the underline is 45% white until hover. Focus is a 3px ink outline at 3px offset; on signs it turns yellow.

## Do's and Don'ts

### Do:
- **Do** route every new line color through `[data-color]` and `--line-color`; add a new hue only as a new `--line-*` token.
- **Do** keep stations as white discs with black rings and bends at exactly 45°.
- **Do** put the one contact action in the yellow information sign, and keep it reachable at the top and bottom of the page.
- **Do** let the metric lead: figure first at Metric or Headline size, sentence under it.
- **Do** set dates and live counters in Overpass Mono with tabular numerals; everything else in Overpass.
- **Do** open sections with a heading over a 4px ink rule.
- **Do** keep state transitions short ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`, 160–220ms) and collapse them under `prefers-reduced-motion`.
- **Do** degrade the diagram to the vertical strip map below 60rem rather than shrinking it.

### Don't:
- **Don't** use yellow for anything but the contact sign and system states (selection, skip link, focus on black).
- **Don't** paint text, panels, borders or hover fills in a line color.
- **Don't** add shadows, gradients, glows or glass; the ride-pass ticket keeps the only lift.
- **Don't** introduce a second typeface or a display serif; the whole site is sign lettering.
- **Don't** animate anything on load or on a timer; the ride replay runs only when the visitor presses Ride.
- **Don't** use rounded card corners beyond the 0.25rem sign corner; objects are circles, capsules or square.
