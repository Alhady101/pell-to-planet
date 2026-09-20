# Pell to Planet

A Wayne State student's guide to funding short-term study abroad, built as the
Follow-on Service Project for a Benjamin A. Gilman International Scholarship.

**Live site:** https://alhady101.github.io/pell-to-planet/

---

## The one rule

Every dollar figure, deadline and award amount lives in `src/data/facts.ts` and
must carry a `source` and a `verifiedOn` date. The Zod schema in
`src/data/schema.ts` runs at import time, so **an unsourced number fails the
build**. Anything not yet known is `status: 'todo'` and renders as a visible
"TO CONFIRM" chip rather than a guess.

Four statuses, shown as chips beside every figure:

| Status     | Meaning |
|------------|---------|
| `verified` | A primary document backs it (statement, award letter, official page). |
| `stated`   | The author's own account, with no document to show. |
| `estimate` | Derived from a stated rate. The method is printed next to the number. |
| `todo`     | Not yet confirmed. Rendered as a visible gap. |

The `/sources/` page generates its outstanding-items list directly from this
data, so it cannot drift out of step with what the pages show.

## Stack

- **Astro 7**, static output, zero JS by default
- No UI framework, no CSS framework, no charting library
- Self-hosted fonts (Instrument Serif, Inter, JetBrains Mono)
- No analytics, no trackers, no third-party requests at runtime

Total client JS is about 60 kB uncompressed, most of which is the globe's
land-coordinate data.

## The generated data

Two build-time scripts turn public-domain Natural Earth geometry into plain
coordinates, so no mapping library ships to the browser:

```
node scripts/build-globe-data.mjs   # -> src/data/land.ts      (hero globe dots)
node scripts/build-japan-map.mjs    # -> src/data/japan-map.ts (trip route map)
```

Both outputs are committed. Re-run them only if the source data changes.

## Develop

```bash
npm install
npm run dev      # http://localhost:4321/pell-to-planet/
npm run build    # static output in dist/
npm run preview
```

## Deploy

Pushing to `main` builds and publishes to GitHub Pages via
`.github/workflows/deploy.yml`.

**One-time setup:** in the repository's Settings → Pages, set **Source** to
**GitHub Actions**.

If the repository is ever renamed, update `base` in `astro.config.mjs` to match.

## Accessibility

Checked across all pages: one `h1` each, no heading-level skips, alt text on
every image, every form control labelled, a `main` landmark, a skip link as the
first focusable element, no positive `tabindex`, and visible focus rings.

Both themes are contrast-checked, and the categorical chart palette is
validated separately against each theme's surface colour.

Motion is an enhancement, never a prerequisite:

- Decorative motion (petals, torii parallax) is removed entirely under
  `prefers-reduced-motion`.
- Scroll reveals hide content only when scripting is confirmed available
  (the hidden state is scoped to `.js`, added by an inline head script).
- The route map's **default state is the finished one**; the animation rewinds
  and replays it. A frozen background tab or a stalled animation still shows a
  complete map.
- A safety net force-reveals anything on screen after 2.5 s regardless.

## Repository layout

```
scripts/           build-time geometry generators
src/data/          facts, trip record, funding directory, generated geometry
src/components/    Globe, JapanMap, ToriiTunnel, Petals, GapCalculator, …
src/layouts/       Base.astro — head, nav, footer, theme, reveals
src/pages/         one file per route
src/assets/photos/ the author's photographs
```

## Licence and use

The writing, photographs and data are the author's. Coastline geometry is from
Natural Earth (public domain). The guide is free for advisors, student
organisations and universities to share.

This is an independent student resource. It is not an official publication of
Wayne State University, the U.S. Department of State, or the Gilman Program.
