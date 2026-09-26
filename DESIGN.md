---
name: Ian Pascoe
description: A career as matter falling toward the present around a black hole; void black, Doppler disk light, one gold photon ring.
colors:
  void: "oklch(12.5% 0.008 280)"
  void-deep: "oklch(8.5% 0.006 280)"
  bone: "oklch(94% 0.012 85)"
  bone-soft: "oklch(82% 0.012 85)"
  bone-quiet: "oklch(68% 0.012 85)"
  rule: "oklch(32% 0.012 280)"
  rule-strong: "oklch(46% 0.014 280)"
  gold: "oklch(84% 0.135 80)"
  approach: "oklch(91% 0.045 255)"
  disk-blue: "oklch(62% 0.11 255)"
  ember: "oklch(66% 0.2 36)"
  void-raised: "oklch(20% 0.01 280)"
  paper: "#fff"
  print-ink: "#111"
typography:
  display:
    fontFamily: "Saira Variable, Saira, Eurostile, sans-serif"
    fontSize: "clamp(3rem, 1.2rem + 6vw, 6rem)"
    fontWeight: 200
    lineHeight: 0.98
    letterSpacing: "0.06em"
    fontVariation: "'wdth' 125"
  figure:
    fontFamily: "Saira Variable, Saira, Eurostile, sans-serif"
    fontSize: "clamp(3rem, 1.2rem + 6vw, 6rem)"
    fontWeight: 180
    lineHeight: 0.95
    letterSpacing: "0.01em"
    fontFeature: "'tnum' 1, 'lnum' 1"
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "Saira Variable, Saira, Eurostile, sans-serif"
    fontSize: "clamp(2.75rem, 1.8rem + 3.4vw, 4.75rem)"
    fontWeight: 200
    lineHeight: 1
    letterSpacing: "0.06em"
    fontVariation: "'wdth' 125"
  section:
    fontFamily: "Saira Variable, Saira, Eurostile, sans-serif"
    fontSize: "clamp(1.875rem, 1.4rem + 1.6vw, 2.75rem)"
    fontWeight: 200
    lineHeight: 1.1
    letterSpacing: "0.08em"
    fontVariation: "'wdth' 125"
  lede:
    fontFamily: "Saira Variable, Saira, Eurostile, sans-serif"
    fontSize: "clamp(1.375rem, 1.2rem + 0.6vw, 1.75rem)"
    fontWeight: 330
    lineHeight: 1.3
  title:
    fontFamily: "Saira Variable, Saira, Eurostile, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "0.02em"
    fontVariation: "'wdth' 112"
  body:
    fontFamily: "Saira Variable, Saira, Eurostile, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 380
    lineHeight: 1.6
    fontFeature: "'lnum' 1"
  meta:
    fontFamily: "Saira Variable, Saira, Eurostile, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 380
    lineHeight: 1.45
    letterSpacing: "0.03em"
    fontFeature: "'tnum' 1, 'lnum' 1"
  label:
    fontFamily: "Saira Variable, Saira, Eurostile, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 450
    lineHeight: 1
    letterSpacing: "0.16em"
    fontVariation: "'wdth' 125"
  micro:
    fontFamily: "Saira Variable, Saira, Eurostile, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 380
    lineHeight: 1
    letterSpacing: "0.14em"
    fontVariation: "'wdth' 118"
  compact-label:
    fontFamily: "Saira Variable, Saira, Eurostile, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 450
    lineHeight: 1
    letterSpacing: "0.16em"
    fontVariation: "'wdth' 125"
  email:
    fontFamily: "Saira Variable, Saira, Eurostile, sans-serif"
    fontSize: "clamp(1.25rem, 0.9rem + 1.4vw, 2rem)"
    fontWeight: 250
    lineHeight: 1.2
    letterSpacing: "0.02em"
    fontVariation: "'wdth' 112"
rounded:
  hairline: "2px"
  capsule: "999px"
  orbit: "50%"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.5rem"
  "6": "2rem"
  "7": "3rem"
  "8": "4.5rem"
  "9": "7rem"
  gutter: "clamp(1.25rem, 0.6rem + 3vw, 3.5rem)"
  column: "min(100%, 36rem)"
  measure: "60ch"
  masthead: "3.5rem"
components:
  button-instrument:
    backgroundColor: "transparent"
    textColor: "{colors.bone}"
    typography: "{typography.label}"
    rounded: "{rounded.capsule}"
    padding: "0 1.5rem"
    height: "3rem"
  button-instrument-hover:
    backgroundColor: "oklch(94% 0.012 85 / 0.06)"
    textColor: "{colors.bone}"
  button-primary:
    backgroundColor: "{colors.void}"
    textColor: "{colors.bone}"
    typography: "{typography.label}"
    rounded: "{rounded.capsule}"
    padding: "0 1.5rem"
    height: "3rem"
  button-primary-hover:
    backgroundColor: "oklch(20% 0.01 280)"
  viewpoint-selector:
    backgroundColor: "{colors.void-deep}"
    textColor: "{colors.bone-quiet}"
    typography: "{typography.micro}"
    rounded: "{rounded.capsule}"
    padding: "3px"
  viewpoint-option-pressed:
    textColor: "{colors.gold}"
    rounded: "{rounded.capsule}"
    height: "2.25rem"
    padding: "0 1rem"
  masthead:
    backgroundColor: "{colors.void-deep}"
    textColor: "{colors.bone}"
    height: "{spacing.masthead}"
    padding: "0 {spacing.gutter}"
  plate:
    textColor: "{colors.bone}"
    width: "{spacing.column}"
    padding: "4.5rem 0"
  plate-figure-current:
    textColor: "{colors.gold}"
    typography: "{typography.figure}"
  horizon-email:
    textColor: "{colors.gold}"
    padding: "0.75rem 0.5rem"
  portrait-orbit:
    rounded: "{rounded.orbit}"
    size: "3.5rem"
---

# Design System: Ian Pascoe

## Overview

**Creative North Star: "The Event Horizon"**

The site is a black hole seen from a patient observer's seat. A full-bleed accretion disk, ray-traced per pixel through curved space in one WebGL fragment shader, fills the fixed background; the career is matter on that disk, each dated fragment a point of light on the ring of its year. The past sits on the outer rim and burns ember where it recedes; the present sits on the photon ring and burns gold. Scrolling is the fall: the camera spirals inward station by station, the disk turns so the fragment being read rotates to the reading position and lights gold, and the page closes at the horizon, where the only thing left is the email address.

Everything that is not the disk is lettering on the void. There are no surfaces to lift, no panels, no cards: structure comes from rings, 1px hairlines, generous void and a single variable family pulled from hairline extended caps down to plain reading text. Light belongs to the disk. The interface borrows it exactly twice: the Doppler gradient that rings the primary button, and the gold that marks whatever is current, focused, or the way to email Ian.

The world is still until the visitor acts. The disk renders only on scroll, resize or input; nothing orbits by itself, and the replay of the whole fall runs only when "Replay 2019 → now" is pressed. Without WebGL the disk hangs as a pre-rendered still at 55% opacity; with reduced motion the camera jumps instead of easing; in print the resume is black on white. Every fact is live text in every one of those states.

**Key Characteristics:**
- Void black ground; the disk is the only large source of light.
- Doppler grading: approaching matter blue-white, receding matter ember, the photon ring gold.
- One family, Saira Variable, used across its width axis: 125% extended hairline caps for names and figures, 100% for reading.
- Hairlines (1px) and rings as the only structural devices; capsules only on instrument controls.
- Scroll-driven camera with a hold-then-move easing so plates are read on a still disk.
- Labels etched onto the disk along their own orbits, haloed in void for legibility.

## Colors

A near-black violet void carrying warm bone lettering, with all chroma reserved for the disk's physical light: blue-white approach, ember recession, and one gold ring.

### Primary
- **Photon-Ring Gold** (`gold`): The one active accent. The current fragment's figure, dates on plates and orbits, the "Now" end of the time rail and its marker, the pressed viewpoint, focus outlines, text selection, the disk labels' figures and ticks, logged observations, and the horizon email address. If it is not current, focused, logged, dated, or the way to email Ian, it is not gold.

### Secondary
- **Approach Blue-White** (`approach`): Matter moving toward the observer. Lives in the shader and at the start of the Doppler border on the primary button.
- **Disk Blue** (`disk-blue`): The deeper tone of the approaching side; available for disk-derived illustration, not for UI chrome.

### Tertiary
- **Ember** (`ember`): Receding, redshifted matter and retired work. The end of the Doppler border; the lone fragment on the 404 drawing. Never used for text or for error states.

### Neutral
- **Void** (`void`): The interior of the primary button, where the Doppler ring encloses darkness.
- **Deep Void** (`void-deep`): Page ground, masthead, the no-WebGL disk backing, phone plate backgrounds, the horizon foot, the viewpoint selector and replay bar fills, and the 3px knockout stroke behind etched disk lettering.
- **Bone** (`bone`): Primary lettering: names, headlines, plate titles, lit figures.
- **Bone Soft** (`bone-soft`): Secondary reading text: facts, summaries, measures, link rows, unlit figures while another fragment is current.
- **Bone Quiet** (`bone-quiet`): Metadata, year numerals on the rail and disk, colophon, unpressed viewpoint labels.
- **Rule** (`rule`): Default 1px hairlines: masthead base, list dividers, phone plate edges, the horizon foot.
- **Rule Strong** (`rule-strong`): Instrument outlines (button, viewpoint selector, replay stop), the time rail, link underlines at rest, dashed orbits.

### Named Rules
**The Doppler Rule.** Chroma is physical. Blue-white means approaching, ember means receding or retired, gold means the photon ring: the present. No hue is used for decoration or for status semantics outside that physics.

**The One Ring Rule.** Gold is the only accent in the interface layer and marks exactly one kind of thing at a time: what is current, focused, dated, logged, or the email. A screen with gold on something that is none of those is wrong.

**The Borrowed Light Rule.** The Doppler gradient (approach → gold at 55% → ember) appears in the UI only as the 1px border of the primary button. It never fills a surface and never colours text.

## Typography

**Display Font:** Saira Variable (with Saira, Eurostile, sans-serif)
**Body Font:** Saira Variable
**Label/Mono Font:** Saira Variable; numerals set lining, and tabular wherever figures align or count.

**Character:** A single squarish technical grotesque stretched across its width axis. At 125% width and weight 180–250 with open tracking it reads as instrument engraving; at 100% width and 380 it is calm, legible reading text. The pairing is one voice at two distances.

### Hierarchy
- **Display** (200, `step-5`, 0.98, 0.06em, extended caps): Ian's name at arrival. One per page.
- **Figure** (180, `step-5`, 0.95, 125% width, tabular lining): The headline metric on each plate ("75%", "1st of 15"). Bone-soft when unlit, gold when current or targeted. Text subjects without a metric drop to `step-3` at 250.
- **Headline** (200, `step-4`, 1.0, 0.06em, extended caps): Organisation names on orbit headers; the 404 title; the resume name.
- **Section** (200, `step-3`, 0.08em, extended caps): Closing section headings (Skills, Your observations). Event plates use the same scale at 250 for their title.
- **Lede** (330, `step-2`, 1.3): The arrival headline and the horizon ask; max 36ch.
- **Title** (500, `step-1`, 112% width, 0.02em): Plate titles, set as `<cite>`; resume entry titles.
- **Body** (380, `step-0` 1.0625rem, 1.6): Facts and summaries at `bone-soft`, max 60ch.
- **Meta** (`step--1` 0.8125rem, 0.03–0.04em, tabular): Plate meta rows, orbit dates, link rows, skill lists.
- **Label** (450, `step--1`, 0.16em, 125% width, uppercase): Button text. The masthead wordmark uses 450 at 0.24em.
- **Micro** (`0.6875rem`, 0.08–0.16em, 112–125% width): Rail years, viewpoint options, plate status, observation timestamps, disk lettering (11–11.5px SVG).

### Named Rules
**The One Family Rule.** Saira Variable only. Hierarchy comes from width (100/112/118/125%), weight (180–500) and tracking, never from a second family.

**The Extended Caps Rule.** Uppercase is always paired with 118–125% width and at least 0.06em tracking. Uppercase at normal width does not exist in this system.

**The Lining Numerals Rule.** All numerals are lining; any number in a column, a rail, a count or a figure is also tabular.

## Layout

The page is two layers: a fixed full-viewport disk canvas at z-index 0 and the reading flow above it at z-index 1. On wide screens the disk's framing is measured from the page, not from screen fractions: the hole sits midway between the reading column's right edge and the viewport's, and the shader darkens the sky fully up to the column's edge, clearing 200px past it, so all text sits in a single left column (`column`, max 36rem) against void while the disk occupies the right. The masthead is fixed, `masthead` tall (3.25rem under 40rem), on deep void with a bottom hairline.

The flow is a sequence of stations, each a camera position: the arrival (100svh; name, headline, portrait, current roles, actions, the address with Copy, three highlights newest first), one band per role or event (an orbit header at 88svh min, then one plate per fragment at 72svh min), the quiet closing sections, and the horizon (100svh, centred, three rows). The camera eases between station anchors with a hold: it stays still for the first 18% of the scroll between stations and settles over the middle 64%, so each plate is read against a stationary disk. The reading line is 46% of viewport height on wide screens, 62% on phones.

Breakpoint `52rem` is the one structural switch. Below it the rail disappears, the viewpoint selector moves to the top of the arrival window (shown only there), the disk recentres above the text (vertical shift, no veil), the arrival shows the disk in a 38svh window and sets everything below it on deep void, and plates become full-bleed slabs of deep void with top and bottom hairlines separated by 30svh gaps. At each station the hole is centred in the gap above the plate at the reading line, so every window frames the disk. Spacing follows the 9-step scale (0.25rem to 7rem); horizontal padding is always `gutter`.

## Elevation & Depth

Flat. There are no drop shadows, no glass, no blur and no tonal surface stack. All depth is optical: it comes from the ray-traced disk itself (gravitational lensing arcs the far side over the shadow; Doppler beaming brightens one side), from the camera's distance and inclination, and from the veil that dims the sky behind reading text. UI layers separate from the disk only by sitting on deep void with a 1px hairline.

### Shadow Vocabulary
- **Knockout ring** (`box-shadow: 0 0 0 3px var(--void-deep)`): The time-rail marker, cutting it cleanly out of the rail line. Not a glow.
- **Etched halo** (SVG `paint-order: stroke; stroke: void-deep; stroke-width: 3px`): Behind every disk label and year numeral, so lettering reads over bright matter.
- **Pressed ring** (`box-shadow: inset 0 0 0 1px var(--gold)`): The pressed viewpoint option.

### Named Rules
**The Light Comes From The Disk Rule.** Glow is physics, rendered in the shader. UI elements never emit light: no outer glows, no coloured shadows, no bloom on buttons or text.

## Shapes

Three forms only. **Hairlines**: 1px rules, underlines (1px, offset 0.28em) and 1–1.5px strokes. **Rings**: circles for the portrait (with a 1px gold outline offset 3px), the observation badges (dashed orbit, gold progress arc, core), the log indicator, the 404 drawing, the rail marker and the disk overlay marker. **Capsules** (999px): reserved for instrument controls: buttons, the viewpoint selector and its options, the replay bar and its stop button, and the transient "Observed" notice under the masthead. Focus outlines take a 2px corner. Everything else is square-edged and borderless: text directly on void.

Icons are 24-unit line drawings at 1.5px stroke with round caps and joins, matching the disk's etched rings; brand and skill marks are filled SVG symbols from one sprite, sized by height.

## Components

### Buttons
Small instrument controls, set in extended caps.
- **Shape:** Capsule (`rounded.capsule`), minimum height 3rem (3.25rem for the arrival email, 2.75rem in the masthead, where the label is `compact-label`), icon at 1.35em.
- **Instrument (default):** Transparent with a 1px `rule-strong` border and bone label; hover raises the border to `bone-soft` and adds a 6% bone wash.
- **Primary:** Void interior inside a 1px Doppler border (approach → gold → ember), bone label, gold orbit icon. Hover lightens the interior to `void-raised`. There is one primary per view, and it is Email Ian (Back to the site on the 404).
- **Hover / Focus:** 180ms colour transitions on `ease` (cubic-bezier(0.16, 1, 0.3, 1)); focus is a 2px gold outline offset 4px.

### Links
Inherit colour, 1px underline in `rule-strong` offset 0.28em, turning gold on hover. Link rows (Resume, GitHub, LinkedIn, X) set a brand mark before the label at `bone-soft`, each at least 2.75rem tall.

### Navigation (Masthead)
Fixed, deep void, 1px `rule` base. Left: the wordmark in extended caps (450, 0.24em). Centre: the time rail, one etched `rule-strong` line from the first year to Now, with tick marks, tabular year links (hover and current in gold), a gold "Now" and a gold 0.5rem marker whose position is the fall's depth. Right: the observation tally (a dashed ring that turns solid gold once anything is logged) and a compact primary Email Ian. Under 52rem the rail is removed.

### Plates
The unit of the record: one fragment, read on the void at the reading line. Figure (metric in extended hairline, or subject), title as a citation, a meta row (mark, organisation, gold date, status after a hairline divider in micro caps), the fact at `bone-soft`, the medium (skills, each with its mark), and an optional external link. The plate at the reading line is `.is-current` and its figure turns gold; every other figure rests at `bone-soft`. States come from the record: orbiting, redshifted, in progress, lost; retired fragments cool to ember on the disk. Each plate has an id and is deep-linkable; a targeted plate's figure is gold.

### Orbit Headers
One per band: brand mark (2.5rem), the organisation in headline extended caps, the role, a gold dated line ("Joined Jun 2019 – now"), a gold-ruled note when the role runs alongside an earlier one (the fall steps back in time there, and says so), an optional summary and link.

### The Disk (signature)
The fixed WebGL canvas, rendered at `min(devicePixelRatio, 1.5) × quality` (quality calibrated down from 0.8 if a frame is slow). The shader draws the disk between radii 3 and 14.5, turbulent filaments turning faster toward the hole, faint bone year rings, every fragment as a point of light (larger and gold as it becomes current, with a gold halo), a gold photon ring hugging the shadow, and a sparse bone starfield. A CPU copy of the same integrator places the SVG overlay: a gold marker and core on the current fragment with a leader, year numerals on the near side of their rings, and the three featured fragments' labels set along their own orbits as `textPath` (gold figure, bone-soft title). Viewpoints: observer (per-station inclination), edge-on, face-on.

### Viewpoint Selector and Replay Bar
Capsule instrument groups, placed after the content in the DOM so keyboard order reaches them last, fixed bottom right (viewpoints, led by a micro "Angle" label on screens over 72rem; hidden at the horizon, where the camera looks straight down) and bottom centre (replay). Viewpoint options are micro caps at `bone-quiet`, bone on hover, gold text with an inset gold ring when pressed. The replay bar has a 1px gold border, a gold tabular year, the fragment title, and an instrument "Stop the replay" button, and a separate polite live region announcing "year, title" (an undated fragment announces its organisation, never an inferred year); while it shows, the viewpoint selector hides. Both are hidden without JavaScript and under 52rem (viewpoints).

### Observations
A grid of ring badges: a dashed `rule-strong` orbit, a gold arc that draws closed over 900ms when logged, and a core that fills gold. Name at 500/112% width, how-to at meta size, timestamp in gold micro caps. A transient capsule notice ("Observed: …") drops under the masthead for 3.8s.

### Horizon
The closing station. The portrait in its gold hairline orbit, the ask, the email address in gold (`email`, underline at 45% gold) and a "Copy address" instrument form one centred group, and the camera's distance and offset are solved from that group's measured size so the whole group sits inside the hole's shadow at every viewport. Without the live disk the horizon is plain deep void. A foot band of deep void carrying the link row, location and colophon.

## Do's and Don'ts

### Do:
- **Do** put all reading text on void: the left column over the veiled sky on wide screens, full-bleed deep-void plates with hairline edges on phones.
- **Do** keep gold for the current fragment, dates, focus, logged state and the email; everything else is bone at one of three strengths.
- **Do** set names, figures and disk labels in extended hairline caps (125% width, 180–250 weight, 0.06–0.16em tracking) and reading text at 100% width, 380 weight.
- **Do** make every number lining, and tabular wherever it aligns or counts.
- **Do** render the disk only in response to scroll, resize or input, and hold it still while a plate is being read.
- **Do** keep every fact as live text for no-WebGL, no JavaScript and a lost GPU context (all show the still, `disk-still.jpg`, at 55%), reduced motion (jumps, 1ms transitions) and print (`print-ink` on `paper`; the home page prints plates only).
- **Do** show the address as text, with a Copy control, wherever the email action appears first on a screen (arrival, horizon).
- **Do** give etched disk lettering a 3px deep-void halo so it reads over bright matter.

### Don't:
- **Don't** use cards, panels, glass, blur or drop shadows; structure is rings, hairlines and void.
- **Don't** use gradient text, and don't use the Doppler gradient anywhere but the primary button's border.
- **Don't** make UI glow; light is rendered by the disk, not emitted by controls.
- **Don't** use capsules for tags, badges or skill chips; the capsule belongs to instrument controls and the transient observation notice.
- **Don't** add a second typeface or set uppercase at normal width.
- **Don't** animate anything on its own: no idle orbiting, no autoplay replay, no looping motion.
- **Don't** use ember or disk blue as status or error colours; they mean receding and approaching matter.
