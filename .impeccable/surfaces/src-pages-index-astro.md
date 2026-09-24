---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/resume.astro","src/pages/404.astro"]
---

## Scope

Home route `/` of ianpascoe.dev, plus its sibling surfaces `/resume` (printable timetable) and the 404 page. Mode: Persuade. Build path: code-led (Ian rejected image-generated comps; no comp is a reference for this build).

## Audience, job, action

Hiring managers and recruiters opening a link Ian sent, usually on a laptop during the workday, sometimes on a phone. They need to understand, within seconds, who Ian is and what he has done. Primary action: email `hi@ianpascoe.dev`. Secondary actions: resume, GitHub, LinkedIn.

## Proof and content

Placeholder content comes only from `resume.md`, via `src/data/timeline.yaml`. Metrics shown: 75% shorter test runs, 60% faster deploys, 100% automated build and deploy, 2 HA Kubernetes clusters (+30% uptime), a team of 5, 2 mentees, 300+ users in 3 months. Playful achievement names are drafts for Ian to edit. No open-to-work line.

## Direction contract

THESIS: Ian's career as a transit system diagram. Roles are colored lines, achievements are stations, and the present is the interchange where every current line meets. It refuses the portfolio default: a hero with a round photo and "Hi, I'm", then a vertical dotted timeline of cards.

OWN-WORLD: Flat, Unimark-era subway signage on paper-white. A black sign band with a thin white rule; white Overpass lettering; round route bullets; thick lines with 45-degree bends; white stations with black rings; a capsule interchange for "Now". Line colors: RTX red, Spirit-Led blue. Information yellow is reserved for contact. No gradients, glow, or glass, and no shadows except the ticket's lift.

STORY: The visitor reads the sign (name, role, lines served), sees the shape of the career in one diagram, opens a station to get the fact behind it, and emails Ian. Explorers ride the network from 2019 and collect punches on a ride pass.

FIRST VIEWPORT: On desktop, a full-width black station sign across the top ~22%: portrait tile, "Ian Pascoe" at display size, headline, R and S route bullets, the yellow "Email Ian" sign and quiet links. Below it, the full-width network diagram (~45%), and under that the station-information strip, which by default shows "Now" with live day counters. "Ride from 2019" sits at the diagram's top right, the ride pass at its bottom right. On mobile, the sign band followed by the vertical strip map, newest first.

FORM: Career Transit Map, item 1 on my ordered list, chosen by Ian as IMPECCABLE'S PICK. Seed key 20c5a16a. Signature interaction: selecting a station isolates its line, dims the rest, and fills the station strip with the metric figure, name, fact, and skills. "Ride from 2019" redraws the network in time order, announcing each station as it arrives, and never runs on its own. Kept from the declined challengers: selecting isolates a line; the metric outranks its sentence; flat ink with no glow; one dataset drives both the diagram and the timetable; current lines count their days live.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Memorable moment

The network drawing itself from the University of Rhode Island in 2019 to the "Now" interchange, with a station announcement at each stop.

## Unresolved

- Real timeline data from Ian replaces the placeholder.
- The RTX title conflict (resume vs README) stays as in `resume.md` until Ian's data arrives.
- Git history rewrite for old contact data is pending Ian's explicit "A".
