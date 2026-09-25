---
name: Ian Pascoe
description: A career hung as a museum retrospective; warm gallery walls, painted rooms, vinyl lettering, and framed data drawings.
colors:
  wall: "oklch(96.6% 0.006 85)"
  wall-sunk: "oklch(93.4% 0.008 85)"
  ink: "oklch(19% 0.006 60)"
  ink-soft: "oklch(38% 0.008 60)"
  ink-quiet: "oklch(49% 0.008 60)"
  rule: "oklch(84% 0.008 80)"
  mat: "oklch(99.3% 0.003 85)"
  moulding: "oklch(17% 0.005 60)"
  gilt: "oklch(72% 0.11 78)"
  gilt-edge: "oklch(52% 0.1 75)"
  light: "oklch(97% 0.05 85)"
  stamp-ink: "oklch(66% 0.17 30)"
  ghost: "oklch(62% 0.006 60)"
  paint-oxblood: "oklch(33% 0.09 22)"
  paint-oxblood-lit: "oklch(26% 0.068 22)"
  vinyl-oxblood: "oklch(97.5% 0.012 40)"
  paint-blue: "oklch(35.1% 0.079 255)"
  paint-blue-lit: "oklch(27.5% 0.06 255)"
  vinyl-blue: "oklch(98.2% 0.006 248)"
  paint-slate: "oklch(35% 0.04 250)"
  paint-slate-lit: "oklch(27.4% 0.032 250)"
  vinyl-slate: "oklch(97.5% 0.008 250)"
  paint-plum: "oklch(32% 0.07 330)"
  paint-plum-lit: "oklch(25.3% 0.053 330)"
  vinyl-plum: "oklch(97.5% 0.01 330)"
  paint-ochre: "oklch(78% 0.1 80)"
  paint-ochre-lit: "oklch(68% 0.09 80)"
  paint-stone: "oklch(90.5% 0.014 80)"
  paint-stone-lit: "oklch(80% 0.016 80)"
  paint-ink: "oklch(17% 0.005 60)"
  vinyl-ink: "oklch(97.5% 0.006 85)"
typography:
  display:
    fontFamily: "Libre Franklin Variable, Libre Franklin, Franklin Gothic, sans-serif"
    fontSize: "clamp(3rem, 1.6rem + 5vw, 6rem)"
    fontWeight: 850
    lineHeight: 0.92
    letterSpacing: "-0.035em"
  display-show:
    fontFamily: "Libre Franklin Variable, Libre Franklin, Franklin Gothic, sans-serif"
    fontSize: "0.56em"
    fontWeight: 300
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  room-sign:
    fontFamily: "Libre Franklin Variable, Libre Franklin, Franklin Gothic, sans-serif"
    fontSize: "clamp(2.5rem, 1.7rem + 3vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  room-numeral:
    fontFamily: "Libre Franklin Variable, Libre Franklin, Franklin Gothic, sans-serif"
    fontSize: "clamp(2.5rem, 1.7rem + 3vw, 4.5rem)"
    fontWeight: 200
    lineHeight: 0.95
    letterSpacing: "-0.03em"
    fontFeature: "tnum"
  headline:
    fontFamily: "Libre Franklin Variable, Libre Franklin, Franklin Gothic, sans-serif"
    fontSize: "clamp(1.875rem, 1.45rem + 1.4vw, 2.625rem)"
    fontWeight: 750
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  metric:
    fontFamily: "Libre Franklin Variable, Libre Franklin, Franklin Gothic, sans-serif"
    fontSize: "clamp(1.875rem, 1.45rem + 1.4vw, 2.625rem)"
    fontWeight: 750
    lineHeight: 0.95
    letterSpacing: "-0.025em"
    fontFeature: "tnum"
  lead:
    fontFamily: "Libre Franklin Variable, Libre Franklin, Franklin Gothic, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 650
    lineHeight: 1.22
    letterSpacing: "-0.012em"
  title:
    fontFamily: "Libre Franklin Variable, Libre Franklin, Franklin Gothic, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Libre Franklin Variable, Libre Franklin, Franklin Gothic, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  work-title:
    fontFamily: "Libre Franklin Variable, Libre Franklin, Franklin Gothic, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "0"
  label:
    fontFamily: "Libre Franklin Variable, Libre Franklin, Franklin Gothic, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 650
    lineHeight: 1.4
  desk-address:
    fontFamily: "Libre Franklin Variable, Libre Franklin, Franklin Gothic, sans-serif"
    fontSize: "clamp(1.5rem, 0.9rem + 2.4vw, 2.75rem)"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  checklist-body:
    fontFamily: "Libre Franklin Variable, Libre Franklin, Franklin Gothic, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.45
rounded:
  none: "0px"
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
  gutter: "clamp(1.25rem, 0.6rem + 3vw, 3.5rem)"
  measure: "62ch"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.wall}"
    rounded: "{rounded.none}"
    padding: "0 1.5rem"
    height: "3rem"
  button-primary-large:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.wall}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "0 2rem"
    height: "3.5rem"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 1.5rem"
    height: "3rem"
  button-masthead:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.wall}"
    rounded: "{rounded.none}"
    padding: "0 1rem"
    height: "2.5rem"
  work-frame:
    backgroundColor: "{colors.mat}"
    rounded: "{rounded.none}"
    padding: "14%"
    width: "15rem"
  plan-room:
    backgroundColor: "{colors.wall}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 0.5rem"
    height: "2.25rem"
  plan-room-current:
    backgroundColor: "{colors.paint-oxblood}"
    textColor: "{colors.vinyl-oxblood}"
  tour-bar:
    backgroundColor: "{colors.paint-ink}"
    textColor: "{colors.vinyl-ink}"
    rounded: "{rounded.none}"
    padding: "0.75rem 0.75rem 0.75rem 1.5rem"
    width: "44rem"
  tour-button-next:
    backgroundColor: "{colors.vinyl-ink}"
    textColor: "{colors.paint-ink}"
    rounded: "{rounded.none}"
    padding: "0 1rem"
    height: "2.75rem"
  checklist-sheet:
    backgroundColor: "{colors.mat}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "clamp(1.5rem, 1rem + 3vw, 4rem)"
    width: "54rem"
---

# Design System: Ian Pascoe

## Overview

**Creative North Star: "The Retrospective"**

The site is a museum retrospective of one engineer's career. The visitor stands in front of a title wall, walks through one painted room per role, reads a museum label beside every framed work, and leaves a question at the visitor desk. Every achievement is a *work*: an exact geometric drawing of its own fact (a reduction, an increase, a count, a seal, a text piece), matted in white, framed in thin black moulding, and hung on one line at eye level. The words are all live text in one family, Libre Franklin, set like vinyl lettering on a gallery wall.

The mood is calm, generous and exact, the house style of a serious modern-art museum rather than a developer template. Walls are warm gallery white; rooms are painted deep, saturated colours with white vinyl lettering on them. Nothing is decorated. Depth comes from real objects hanging on a wall (a two-layer hung shadow) and from light: a warm picture-light pool behind each work that brightens when the work is opened while the rest of its room goes dark. Light is the only state change the rooms have.

Structure comes from the voids between rooms, not from boxes. There are no cards, no rounded corners, no gradients as fill, no glass and no badges. Motion is slow and settled (a 520ms ease-out for light, 180ms for small feedback) and nothing ever moves on its own: the guided tour starts only when the visitor asks for it.

**Key Characteristics:**
- Warm gallery-white walls with painted rooms; vinyl lettering flips from ink-on-white to white-on-paint via one token set.
- One family (Libre Franklin Variable, weights 200–850, true italic); titles of works always italic.
- Works are exact SVG drawings of their facts, framed with a black moulding border, a white mat, and a hung shadow.
- The museum label is the unit of content: figure, italic title with date, a one-sentence detail only when the figure and title leave something unsaid, medium, catalogue number.
- Light is the only state: lit pool up, room darkened, other labels dimmed; deep-linkable by `#work-id`.
- Square corners everywhere; rules are 1px hairlines in the room's own rule colour.

## Colors

A warm, low-chroma gallery neutral set carries the site; saturated colour lives only in the paint of rooms, the gilt of increases, and the red of passport stamps.

### Primary
- **Gallery Ink** (ink): the vinyl lettering on white walls, solid button fill on walls, the 2px rule that opens the visitor desk, and the lit edge of the floor plan's Entrance and Desk.
- **Moulding Black** (moulding): the frame border around every work, the portrait, and the 404 frame, and the ink of every data drawing inside the mat.

### Secondary (room paints)
Each room is painted by `data-paint`, which sets five tokens at once: `--paint` (the wall), `--vinyl` (lettering), `--vinyl-soft` (secondary text), `--vinyl-quiet` (credits, meta), `--vinyl-rule` (hairlines). Components read only these five, so the same label, button and rule render correctly on any paint.
- **Oxblood** (paint-oxblood, lettered in vinyl-oxblood): the RTX room.
- **Spirit-Led Navy** (paint-blue, lettered in vinyl-blue): the Spirit-Led Software room, in the navy of spiritledsoftware.com.
- **Stone** (paint-stone, lettered in ink): the default paint for rooms made from events alone (the University of Rhode Island room).
- **Slate**, **Plum** (dark, white vinyl) and **Ochre** (light, ink vinyl): available paints in the schema, unused by the current data.
- **Night** (paint-ink, lettered in vinyl-ink): the guided-tour bar; floating signage, never a room.

### Tertiary
- **Gilt** (gilt): the added rows of an increase drawing, the gilded dot of a ranking, and the text-selection highlight, each gilt shape edged in **Gilt Edge** (gilt-edge) so it holds 3:1 on the mat. Nothing else.
- **Stamp Red** (stamp-ink): passport stamps once earned, and the masthead passport mark after the first stamp.
- **Picture Light** (light): the warm pool behind works, mixed at 44% into a radial gradient.

### Neutral
- **Gallery White** (wall): the page wall, the masthead background, and every unlit floor-plan room.
- **Sunk Wall** (wall-sunk): the wall behind the resume sheet, floor-plan hover, scrollbar track.
- **Mat White** (mat): the mat inside every frame and the resume sheet itself.
- **Ink Soft** (ink-soft) and **Ink Quiet** (ink-quiet): secondary and tertiary text on walls; wall defaults of `--vinyl-soft` / `--vinyl-quiet`.
- **Wall Rule** (rule): 1px hairlines on white walls; the dashed empty mat on the 404 frame.
- **Ghost** (ghost): the thin outlines of the squares a reduction has taken away.

### Named Rules
**The Paint Carries Its Lettering Rule.** Never set a colour on text inside a room directly; read `--vinyl`, `--vinyl-soft`, `--vinyl-quiet`, `--vinyl-rule`, and let `data-paint` decide. A new paint must supply all five.

**The Gilt Is Growth Rule.** Gilt means "more than before": increase squares and selection only. It is never a button, a link, or a heading colour.

**The Red Is Earned Rule.** Stamp red appears only once a visitor has earned a stamp. Unearned stamps are dashed, quiet vinyl.

## Typography

**Display Font:** Libre Franklin Variable (with Libre Franklin, Franklin Gothic, sans-serif)
**Body Font:** Libre Franklin Variable, the same family
**Label/Mono Font:** none; numerals use `tabular-nums lining-nums` via `.tabular`

**Character:** One Franklin Gothic–lineage grotesque does everything, as in a museum's own signage: very heavy for names on the wall, feather-light for numerals and the show title, true italic for titles of works. Hierarchy comes from weight and size contrast, never from a second family.

### Hierarchy
- **Display** (850, `--step-5`, 0.92): the exhibition title on the title wall (the name).
- **Display Show** (300 italic, 0.56em of display, 1.05): "Selected Work, 2019–2026" beneath the name.
- **Room Sign** (800, `--step-4`, 0.95, −0.03em) with **Room Numeral** (200, same size, `--vinyl-quiet`): the room's number set light beside its name. Page titles on the resume and 404 use `--step-4` at 850.
- **Headline** (750, `--step-3`): the visitor-desk question and the Index of media heading.
- **Metric** (750, `--step-3`, 0.95, tabular): the figure that heads a museum label ("75%"); drops to `--step-2` on phones.
- **Lead** (650, `--step-2`, 1.22): the headline sentence on the title wall.
- **Title** (700, `--step-1`, 1.3): room role, section headings (Highlights, passport).
- **Body** (400, `--step-0`, 1.55): wall text and label detail, capped at `--measure` (62ch) or 38rem on the title wall.
- **Work Title** (600 italic `cite`, `--step-0`, 1.35): the title of a work, followed by its date in roman 400.
- **Label** (600–650, `--step--1`): medium and catalogue-number lines, floor plan, tour step, passport note.

Base headings are 750 at line-height 1.08 and −0.015em, with `text-wrap: balance`; paragraphs use `text-wrap: pretty`.

### Named Rules
**The Italic Is a Title Rule.** Italic marks the title of a work (`<cite>`), the show line and the email address at the desk. Never italicise for emphasis.

**The One Family Rule.** Libre Franklin is the only family, including inside SVG drawings and stamps (`font-family: var(--font)`). Weight is the only voice change.

## Layout

The page is a sequence of full-bleed walls, each holding a centred `.wrap` (max 90rem, `--gutter` side padding). Order: sticky masthead, title wall, one painted room per role, index of media, visitor desk. Rooms are separated by paint and by generous vertical space (`--space-9` above, `--space-9 + --space-4` below), not by dividers.

- **Title wall:** 7fr / 4fr grid; title, headline, actions and links left (no explanatory wall text; the drawings explain themselves); the framed portrait with its label right; three highlights hang small below on one line.
- **Room wall text:** 5fr / 6fr grid, room sign left, role, dates and summary right, closed by a 1px `--vinyl-rule` line.
- **The hang line:** works fill `repeat(auto-fill, minmax(min(100%, 17.5rem), 1fr))`; each work spans two subgrid rows, frame then label, and every frame centres vertically in the first row so all frames in a row share one eye level and all labels start on one line. Frame widths vary by drawing kind (12–16rem; featured 16–18.5rem).
- **Compact rooms** (one or two works, above 52rem) hang the works beside the wall text in the same 5fr / 6fr grid.
- **Visitor desk:** 7fr / 5fr, contact left and leading, the smaller passport right; one column below 56rem.
- **Breakpoints:** 60rem (plan drops room names to numerals), 56rem (title wall and desk stack; the headline follows the title, then the portrait, then the actions), 52rem (rooms stack, tighter padding), 40rem (masthead grows to two rows, 6.5rem, every target 2.75rem; the plan names its rooms by first word; works and highlights hang beside their labels in a 7.25rem column, so a room reads as a list), 36rem (tour bar keeps one row, arrow-only buttons), 22.5rem (plan falls back to numerals).
- **Rhythm:** a 0.25rem-based scale (`--space-1`..`--space-9`: 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4.5, 7rem). Label internals use `--space-1`/`--space-2`; room and wall gaps use `--space-7`/`--space-8`.

## Elevation & Depth

Depth is physical and sparse. The wall is flat; only objects that really hang or float cast shadows, and light is the only thing that changes elevation.

### Shadow Vocabulary
- **Hung** (`--hung`: `0 1px 1px oklch(0% 0 0 / 0.22), 0 14px 28px -10px oklch(0% 0 0 / 0.38)`): every frame, the portrait, the resume sheet and the 404 frame.
- **Float** (`--float`: `0 18px 40px -12px oklch(0% 0 0 / 0.55)`): the guided-tour bar, the only thing that floats over the rooms.
- **Lit**: the opened work lifts (`translateY(-3px) scale(1.015)`) and its shadow deepens; its siblings flatten to a 1px contact shadow and dim to `brightness(0.8)`.

### Named Rules
**The Light Is the State Rule.** Opening a work raises its picture-light pool from 0.28 to full opacity, turns its room to the paint's own lit value (`--paint-lit`: the same hue, about 72% of the lightness; light paints also re-letter their soft and quiet vinyl one step darker), removes the other pools, dims the other frames, and drops the other labels to `--vinyl-quiet`. Every lettering step keeps 4.5:1 on every lit paint. No outlines, no hue shifts, no overlays (forced-colors mode alone outlines the lit frame in `Highlight`). The state is a `#work-id` hash, so it is linkable; without JavaScript a `:target` work still gets its full pool.

**The Hanging Things Only Rule.** Shadows belong to hung objects and the tour bar. Text, rules, buttons and panels sit flat on the wall.

## Shapes

Every corner is square (`border-radius: 0`); the only curves are circles in the drawings: count dots, the document seal, passport stamps. Frames are a solid moulding border (0.3rem on works, 0.35rem on portrait and 404 frame, 0.25rem on highlights, 0.2rem on phones) around a white mat padded 12–14%. Hairlines are 1px in the room's rule colour; floor-plan rooms are 1.5px ink boxes sharing walls, with 1.5px doorways cut between them. Icons are 24px line drawings, stroke 1.75, square caps and mitred joins (`src/lib/icons.ts`); marks are flat filled silhouettes (see Marks).

## Components

### Buttons
Printed like the gallery's own signage: flat, square, heavy.
- **Shape:** square (0px), 2px border in `--vinyl`.
- **Primary:** `--vinyl` fill, `--paint` text, 700 weight, 3rem min height, `0 --space-5` padding, optional leading 1.2em icon. On a white wall this is ink on gallery white; inside a room it inverts to the room's vinyl.
- **Hover:** fill mixes toward the paint (`color-mix(in oklch, var(--vinyl) 86%, var(--paint))`), 180ms.
- **Quiet:** transparent with vinyl border and text; hover adds a 10% vinyl wash.
- **Sizes:** the title-wall email is 3.5rem tall with `--space-6` padding at `--step-1`; the masthead email is 2.5rem at `--step--1`. The desk has no button: its display-size italic address is the action.
- **Focus:** 2px `--vinyl` outline, 3px offset (6px on frames).

### Framed Work (signature)
A button that is a picture: moulding border, white mat, and an exact SVG drawing of the fact, `cursor: zoom-in`.
- **Reduction:** 100 ink squares on a 10×10 grid; the squares taken away remain as thin `--ghost` outlines.
- **Increase:** 100 ink squares plus the added percent as extra gilt rows.
- **Count:** one ink dot per unit (large dots up to 16; a 10- or 20-column dot field beyond, with an open ring for "+"). A ranking ("1st of 15") is a count whose dot at that place is gilt.
- **Document:** a seal with the tag set twice around a circle on a text path and the year in the centre. When the event names an issuer whose mark is a symbol, the mark fills the centre and the year sits small beneath it.
- **Text piece:** the subject set in 800 weight, sized to the largest size whose wrapped lines fit the 4:3 mat in both width and height.
- Hover lifts the frame 2px; opening it lights it (see Elevation). Each drawing carries an `aria-label` that states the fact in words ("Drawing: 15 dots, the 1st in gold: 1st of 15 Industry Øne organisations to deploy."). The frame is a toggle named "Light {title}" and described by its drawing.

### Museum Label
Sits under its frame, max 24rem. A room's grid gives every hang three shared rows (frame, figure, text), so frames share an eye line and titles share a line even when a neighbour has no figure: figure (metric + measure) → italic title, date → optional one-sentence detail in `--vinyl-soft` (omitted when the figure says it all) → status ("In progress", "Retired"; uppercase label, no box) → medium (a list of skills, 600, `--step--1`, each led by its 1.25em mark) → catalogue number ("No. 2019.1", `--vinyl-quiet`; the room already names the org and years) → optional external link with a 1em arrow.

### Room Sign
Room number in weight 200 and `--vinyl-quiet`, set beside the room name in 800 at `--step-4`; the org's mark is lettered in vinyl above the name (1.6em for a symbol, 1.1em for a wordmark). Role, dates ("Joined Jun 2019 · Day 2,674") and summary on the right.

### Navigation (floor plan)
The sticky masthead (`--masthead` 3.75rem, gallery white, 1px rule below) holds the wordmark (name 800, "Selected Work" italic), a floor plan of the rooms, the passport tally and the email button. The plan is a row of 2.25rem boxes sized by each room's work count and never narrower than its own name: Entrance, numbered rooms, Desk. The room the visitor is in gets `aria-current="location"` and fills with that room's paint and vinyl (Entrance and Desk fill ink; the index of media counts as the Desk). The plan's focus ring is always gallery ink, whatever the swatch's paint. Below 60rem rooms show numerals only; below 40rem the plan takes its own full-width row, 2.75rem tall, naming each room by its first word ("Spirit-Led"), and below 22.5rem it falls back to numerals.

### Guided Tour Bar
A fixed bar painted `ink`, centred at the bottom (max 44rem) with the float shadow: the room and step ("Room 1 · RTX · 3 of 11") above the italic title and its date, then Previous, Next/Finish (solid vinyl) and a square close; on phones one 64px row of arrow-only buttons. The tour walks the rooms in their hanging order, each room's works in time order, so the light only ever moves forward through the building. Enters with a 520ms rise; arrow keys step, Escape ends and leaves focus on the frame where the tour stopped. It never starts on its own and earns only its own stamp.

### Gallery Passport
A 1px-ruled panel at the desk with a grid of 4.25rem circular stamps. Each stamp carries a line-icon emblem of what earns it (an eye, two rooms, a framed mat, the picture light, the checklist, a frame on its wire, a letter). Unearned: dashed, quiet outlines with name and hint. Earned: solid `--stamp-ink`, rotated by a per-stamp tilt, ring text and date shown (the date also in words for screen readers), with a 520ms press-in. Only what the visitor opens counts toward the looking stamps; the tour and deep links don't, and "Every wall" needs a room of two or more works. The masthead tally shows a dashed ring that turns stamp red after the first stamp; a new stamp's name hangs under the masthead as a small ink ticket for 3.8s (out of flow, so the plan never moves), and one status line announces it to screen readers. Without JavaScript the passport and the tour don't hang.

### Marks
Organisation logos and skill glyphs live in `src/lib/marks.ts`, are published once as the `/marks.svg` sprite (`src/pages/marks.svg.ts`), and render through `Mark.astro` as a `<use>` of their symbol: one flat silhouette filled with `currentColor`, so every mark takes the vinyl of the wall it sits on, like the lettering around it. Never set a mark in its brand colours. A **symbol** (RTX burst, Spirit-Led dove, AWS, GitHub, LinkedIn, the tool logos, and generic glyphs for skills without one) may sit inside a line of text or a seal; a **wordmark** (the University of Rhode Island) appears only on its room sign. Marks appear on room signs, before skills on the medium line and in the index of media (1.25em, one wrapped line of skills, each linking to its latest work), before the org on the portrait label, highlights and resume headings, before GitHub and LinkedIn links, and before "Source on GitHub". Marks beside text that names them are `aria-hidden`.

### Checklist Sheet (resume)
The resume is a checklist of works: a mat-white sheet (max 54rem) hung with `--hung` on the sunk wall; name at `--step-4` 850 over a 2px ink rule, rooms as 1px-ruled sections, works as rows (fact, a quiet line of media, and the date on the right where a resume keeps it; catalogue numbers stay in the exhibition), prose capped at 38em (about 75 characters). Prints to letter at 10pt with no shadow and no toolbar.

### Closed for Installation (404)
An empty frame (dashed-rule mat) hung from an SVG wire: a thin `--ink-quiet` line from one ink hook to the frame's corners, with a room-sign-scale heading and primary/quiet buttons.

### Motion
`--ease` is `cubic-bezier(0.16, 1, 0.3, 1)`; `--fast` 180ms for link underlines, button fills and tour buttons; `--slow` 520ms for light, frames, room darkening and plan fills. Under `prefers-reduced-motion` every transition and animation collapses to 1ms and tour scrolling jumps instead of gliding.

## Do's and Don'ts

### Do:
- **Do** turn every new achievement into a framed work with an exact drawing of its fact and a full museum label; the drawing's `aria-label` must say the fact in words.
- **Do** paint a new room with `data-paint` and let components read `--paint` and the four vinyl tokens; the button, label, rule and focus ring follow automatically.
- **Do** keep all frames in a row on one hang line with the two-row subgrid (frame centred, label top-aligned).
- **Do** express state as light: pool opacity, room darkening, label dimming, 520ms `--ease`.
- **Do** italicise titles of works with `<cite>` and keep dates roman.
- **Do** use square corners, 1px vinyl hairlines, and the `--space-*` scale.

### Don't:
- **Don't** add a second typeface, including for code or numerals; use `.tabular` instead.
- **Don't** box content in rounded, shadowed cards; only hung objects (frames, the checklist sheet) and the floating tour bar cast shadows.
- **Don't** use gradients as fill; the only gradient is the radial picture-light pool behind a work.
- **Don't** use gilt or stamp red outside increases, selection and earned stamps.
- **Don't** animate anything on page load or start the tour automatically; nothing moves or plays on its own.
- **Don't** put glass, blur, badges or pill shapes on the walls.
