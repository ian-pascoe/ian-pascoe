# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

- Astro with static output; SolidJS only for the interactive timeline island.
- Deployed with alchemy v2 (beta, pinned to an exact version, lockfile committed) to Cloudflare via `Cloudflare.Website.Astro`, static assets only.
- Production domain: `ianpascoe.dev` (Cloudflare Registrar and Cloudflare DNS), with `www` redirecting to the apex.
- Bun as package manager and runtime.
- Images: the assets-only deploy has no `/_image` endpoint (alchemy's Cloudflare adapter uses Astro's passthrough image service), so never use `astro:assets` `<Image>`/`<Picture>`/`getImage`. Import the file and render `<img src={asset.src}>`, sizing the source file itself.
- Deploys: GitHub Actions deploys stage `prod` on push to `main`; each pull request deploys stage `pr-<n>` to a workers.dev preview URL, posted on the PR and destroyed when the PR closes. Alchemy state lives in the Cloudflare account (`Cloudflare.state()`).
- CI credentials: a scoped Cloudflare user API token ("ianpascoe.dev deploy (alchemy + GitHub Actions)") plus account ID, stored as the repo secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`; the local alchemy `default` profile uses the same token. Account permissions: Workers Scripts Write, Secrets Store Write, Account Settings Read and Write (Web Analytics requires Read explicitly), Email Routing Addresses Write. Zone `ianpascoe.dev` permissions: Zone Read, Zone Settings Write, Email Routing Rules Write, Dynamic URL Redirects Write, Workers Routes Write, DNS Write.
- Email: `hi@ianpascoe.dev`, forwarded to Ian's Gmail by Cloudflare Email Routing and managed in the same alchemy stack.
- Analytics: Cloudflare Web Analytics only (no cookies, no consent banner). Visitor achievements are not tracked server-side.

## Users

Primary: hiring managers and recruiters evaluating Ian for a role. They arrive, need to understand his career quickly, and decide whether to reach out.

## Product Purpose

Ian Pascoe's personal website. It presents his career as a timeline in which milestones are shown as unlocked achievements. Success: a hiring visitor emails Ian. Secondary actions: opening his resume or GitHub.

Headline: "Platform engineer & tech lead building AI-agent developer tools". The site does not say Ian is looking for work; he shares it with recruiters himself.

## Positioning

A career told as a record of unlocked achievements, each tied to a concrete, dated fact from Ian's own history, rather than a list of adjectives. Visitors can also unlock a small set of their own achievements by exploring.

## Capabilities and Constraints

- The repo is Ian's public GitHub profile repo (`ian-pascoe/ian-pascoe`). `README.md` must stay at the repo root, is maintained by hand, and is independent of the site build. Site code also lives at the repo root.
- Timeline content is authored by Ian in one schema-validated file, `src/data/timeline.yaml`. Invalid data fails the build.
- The entry model has two kinds. **Spans** (roles, education, companies) have start and end dates, and parallel spans run on separate tracks. **Events** (certifications, launches, milestones) are single dated points. Achievements are listed inside entries; an achievement may have its own date, and without one it belongs to its parent span.
- Until Ian supplies his timeline, the placeholder content is the events in `resume.md` only. No GitHub or npm data is added.
- Visitor achievements: about 6–8, earned by exploring, with progress stored only in the visitor's browser (localStorage). No content is ever locked behind an achievement.
- Achievements carry a playful name drafted by the site author for Ian to edit, always shown beside the plain fact, plus skill tags. Skills are presented only through the achievements that prove them. Placeholder tags come only from `resume.md`'s own skill lists and are marked as drafts.
- Entries flagged `featured: true` (about 3) appear on the first screen.
- The timeline opens at the present, with an optional replay from the beginning that never starts on its own. Without JavaScript, the full timeline renders as a readable list.
- `/resume` is generated from the same timeline data and prints cleanly to PDF.
- Static site only: no contact form and no server-side state.
- Phone number and street address removed from git history (2026-09-24 rewrite of `resume.md`, force-pushed to `main`); never republish them.

## Brand Commitments

- Name: Ian Pascoe. Location shown only as "Jacksonville, FL".
- Contact channels: email, LinkedIn (`linkedin.com/in/ian-pascoe`), GitHub (`github.com/ian-pascoe`). No phone number and no street address anywhere on the site.
- Faith appears only through the work itself (Spirit-Led Software, The AI Study Bible). The site contains no authored personal faith statements.
- Portrait: `pfp.jpeg`, cropped to head and shoulders.
- Anti-references: cartoonish or parody game UI that undercuts Ian with a hiring manager; the generic dark "developer portfolio" template; anything that plays sound or moves on its own.

## Evidence on Hand

- `resume.md`: roles, dates, and metrics (75% shorter test runs, 60% faster deploys, 30% better uptime, a team of 5, 2 mentees, 300+ users in the first 3 months), certifications, and education. This is placeholder material.
- `README.md`: current profile summary and flagship projects.
- `pfp.jpeg`: portrait photo.
- Known conflicts, to be resolved by Ian's timeline: the RTX title (`resume.md` says "Principal Software Engineer"; `README.md` says "Technical Lead & Platform Engineer" / "Principal Specialist"), and the AI Study Bible stack (the two files disagree).
- Dead links in `resume.md`: `theaistudybible.com` (no DNS) and `github.com/spirit-led-software/clerk-solidjs` (404). Working replacements are under `github.com/spiritledsoftware/`.
- Absences: no testimonials, no press, and no dates for the AI Study Bible launch or clerk-solidjs in the resume. Do not fabricate any of these.

## Product Principles

1. Evidence over adjectives: every achievement points to a real fact from Ian's own data, and no metric or claim is invented.
2. Play never gates information: every fact is reachable without earning anything.
3. The way to contact Ian is always within reach.
4. Ian owns the record: the site renders his data and never embellishes it.
5. Minimal personal exposure: publish only what a hiring visitor needs.
