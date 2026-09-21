# Handoff

**Read this file completely before changing anything.**

This is *Pell to Planet*, Gotibeh Alhady's Gilman Follow-on Service Project.
It is public, carries his name, and reports to a U.S. Department of State
scholarship program. That changes the engineering rules, so this document
starts with the rules and only then describes the code.

Repo owner: Alhady101 · Stack: Astro 7 static site · Deploy: GitHub Pages

---

## 0. The rule that overrides everything else

**Never invent a cost figure, award amount, deadline, statistic, or quote.**

Not as a placeholder. Not as an illustration. Not "roughly." Every number on
this site is either something Gotibeh personally paid and can document, or a
figure published by a named institution on a named date.

If you need a number you do not have, the correct action is to mark it as a
TODO and say so out loud. The data layer already supports this: set
`status: 'todo'` and `amountUSD: null`, and the site renders the gap
honestly instead of hiding it.

This is not a style preference. A fabricated aid figure on a Gilman project
page is the kind of error that costs a student a scholarship relationship.

### The build enforces it

`src/data/schema.ts` is a Zod schema. Every fact must carry a non-empty
`source` and an ISO `verifiedOn` date, and any fact that is not a TODO must
carry an amount:

```ts
.refine((f) => f.status === 'todo' || f.amountUSD !== null, {
  message: 'A fact that is not a TODO must carry an amount',
})
```

`src/data/facts.ts` parses every record at import time, so an unsourced
figure does not render badly, it **fails the build**. This was tested
deliberately by injecting a bare number and confirming the ZodError.

Do not weaken this schema to make a number easier to add. The friction is
the feature.

---

## 1. How to move this project to another model or machine

The whole project is plain text plus images. There is no database, no build
service, and no hosted state. Three options, best first.

**Push to GitHub, then point the other model at the repo.** Best, because
the other model gets the full commit history, which is where the reasoning
lives. Each commit message explains why, not just what.

```bash
# Create an EMPTY public repo named pell-to-planet under Alhady101,
# with no README, no .gitignore, no license. Then:
git remote add origin https://github.com/Alhady101/pell-to-planet.git
git push -u origin main
```

Then set **Settings, then Pages, then Source, then GitHub Actions**. The
workflow is already committed, so the site builds and publishes on every push.

**Zip the folder.** Works offline. This excludes the junk automatically,
because it only includes tracked files:

```bash
git archive --format=zip -o pell-to-planet.zip HEAD
```

The result is roughly 30 MB, almost all photographs. `node_modules` and
`dist` are left out.

**Hand over this file alone.** If another model only gets one file, this is
the one. It is written to be self-contained.

Whoever picks it up runs `npm install` then `npm run dev`. Nothing else.

### The prompt to paste into the next model

```
This is an Astro static site: my Gilman Follow-on Service Project, which is
public and attached to my name and a federal scholarship.

Read HANDOFF.md first and completely, then confirm back to me two things:
the one rule you must never break, and the three traps in section 5.

Your job is craft, not facts. Make the motion and the visual polish more
alive. Do not add, change, or estimate any dollar amount, date, statistic,
or quote. If a number is missing it stays a TODO.

Run `npm run build` after every change. It validates every figure against a
schema, so a green build is your proof you did not break the factual layer.
```

The confirmation step is not ceremony. It is a cheap way to find out whether
the model actually read the constraints before it starts editing.

---

## 2. What the site is

A Wayne State mechanical engineering student went to Japan for a
faculty-led summer program and paid for it with a Pell-linked federal
scholarship. The site is the honest financial and personal record of how
that happened, written so the next student can copy the method.

Nine pages plus a 404:

| Page | Job |
| --- | --- |
| `index` | The hook. Globe, the headline numbers, the argument. |
| `the-trip` | What the fifteen days actually were. 26 photographs. |
| `my-numbers` | Every dollar in and out, with sources. |
| `funding` | A directory of what to apply for, and when. |
| `gilman` | What Gilman is and how the application really works. |
| `tools` | The gap calculator. |
| `for-advisors` | The version an advisor or sponsor can act on. |
| `sources` | Every figure, traced to its origin. |
| `what-i-gained` | The manufacturing to supply-chain argument. |

The audience is three-headed and the design has to serve all three: a
student who needs the method, a scholarship committee checking rigor, and an
employer reading it as a portfolio piece.

---

## 3. Architecture in one page

```
src/
  data/          the factual core — everything else renders from here
    schema.ts      Zod contracts; the integrity mechanism
    facts.ts       costs, funding, payments, deadlines, Gilman cycles
    funding.ts     the funding directory
    trip.ts        itinerary: 5 stops, 4 overnight bases
    destinations.ts  the travel wishlist plotted on the globe
    land.ts        GENERATED — 8,870 land dots for the globe
    japan-map.ts   GENERATED — 34 coastline rings
  components/    Globe, ToriiTunnel, JapanMap, Petals, GapCalculator, and more
  scripts/globe.ts    the canvas globe renderer
  layouts/Base.astro  head, nav, footer, scroll reveals, view transitions
  styles/global.css   the design system: tokens, type scale, motion
scripts/         build-time generators, run by hand, output is committed
```

**The data layer is the point.** Pages contain no hard-coded money. They
import from `facts.ts` and render. Change a number in one place and every
page, chart, and total moves together, or the build fails.

**The two generated files.** `land.ts` and `japan-map.ts` are produced by
the scripts in `scripts/` from Natural Earth public-domain geometry, and the
output is committed. This is deliberate: the browser ships plain coordinates
instead of a mapping library. Regenerate with
`node scripts/build-globe-data.mjs`. Do not hand-edit the output.

**Zero JavaScript by default.** Astro ships HTML. The only scripts are the
globe, the torii dolly, the reveal observer, and the calculator. Everything
else, including the whole layout and all typography, works with JavaScript
disabled.

---

## 4. What was wrong before, what changed, and why

This is the part another model most needs, because several of these were
non-obvious and re-introducing them is easy.

### The first version was a document, not an argument

It presented numbers in tables and expected the reader to assemble the
meaning. The rebuild leads with the conclusion on every page, then supports
it. The headline is not "here is my budget," it is the gap and how it
closed. Roughly **$8,010** of cost, **$3,500** in trip-specific awards, about
**$1,430** of term aid attributable to the three credits, leaving roughly
**$3,080** out of pocket.

### Term aid was being counted wrong, and that mattered

The original treated the semester's financial aid as if it applied to the
trip. It does not. The trip was 3 credits inside a 13-credit term. Only
3/13 of the term aid is honestly attributable to it. That correction moved
the out-of-pocket figure by over a thousand dollars in the *unflattering*
direction, which is exactly why it had to be made.

The gap calculator on `tools` reproduces this split, because every generic
study-abroad calculator gets it wrong the same way.

### Two entries actively misinformed students

Scholarship Universe was listed as a funding route with no caveat. It has an
exclusion that makes it inapplicable here. Listing it without the exclusion
would send students down a dead end.

An endowed award was listed as if it were findable. It is not listed
publicly, and Gotibeh only learned of it through an advisor. Rather than
delete it, the entry was reframed around that fact, and it became the
strongest lesson on the funding page. The money you can find in a database
is not all the money there is. Talk to your advisor.

A fact-check gap turned into the best content on the page. Look for that
move before deleting something inconvenient.

### The itinerary was structurally wrong

The site had Kyoto as an overnight stop and Hamamatsu as a pass-through.
The official itinerary spreadsheet showed the opposite. **Kyoto was a day
trip out of Osaka**, and **Hamamatsu was a base** for the Yamaha factory
visit at Kakegawa. Now five stops, four overnight bases. See `trip.ts`.

### The torii was rebuilt three times

First as flat SVG, then as a genuine 3D renderer with lit, depth-sorted
geometry. The geometry was correct and it still looked like an untextured
game asset, because what sells a shrine gate is weathered timber, painted
kanji, wet stone, and depth haze. Flat-shaded polygons give you none of
that. A photograph does.

So the corridor is now a licensed photograph, and the code does the one
thing code is better at, which is **moving the camera**. Scroll drives a
dolly that scales the image about its vanishing point, so the gates
genuinely approach as you read.

The lesson generalizes. Do not hand-build photorealism. Light the
photograph and move the camera.

### The motion pass

Audited against Emil Kowalski's animation philosophy. Four real findings,
all fixed.

- `ease-in` on the view transition. Ease-in starts slow and ends fast, which
  is how something falls out of the world. Interface should leave fast and
  settle slow. **On UI, ease-in is always a bug.**
- The scroll progress bar animated `width`, forcing layout and paint on
  every scroll frame. Now `transform: scaleX()`, which stays on the
  compositor thread.
- Five `:hover` transforms fired on touch, where a hover is a tap that then
  sticks. Gated behind `@media (hover: hover) and (pointer: fine)`.
- Six hand-typed cubic-beziers that were nearly but not exactly equal.
  Consolidated into tokens.

Motion tokens now live in `global.css`. Use them, do not type new curves:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--dur-press: 140ms; --dur-hover: 200ms; --dur-reveal: 640ms;
```

---

## 5. Traps, meaning bugs already paid for

Each of these cost real debugging time. They are all still easy to step
back into.

### `color-mix(in oklab, X, transparent)` does not do what it reads like

It interpolates toward **black** as alpha falls, so a nominally 26% scrim
renders nearly opaque and buries whatever is underneath. It made the torii
photograph invisible.

Use real alpha instead. The codebase defines `--void-rgb` for exactly this:

```css
background: rgb(var(--void-rgb) / 0.58);   /* correct */
```

### A CSS filter on a large image can exceed the GPU layer budget

A 2400px image at 2.5x device pixel ratio, with `filter` and `will-change`,
produced a roughly 45 MB composited layer. Chrome declined to paint it. The
photo was in the DOM, fully loaded, and **invisible**, with no error message
anywhere.

The fix was to bake the grade into the JPEG and cap the source at 1800px.
There is a comment in `ToriiTunnel.astro` saying so. Do not add a filter
back to that element.

### Never let direct interaction depend on an animation loop

This produced three separate bugs, and it is the single most valuable
lesson in the project.

The globe drag mutated `yaw` and waited for the `requestAnimationFrame`
loop to repaint. When the loop had stopped, because the globe had settled,
nothing painted and the globe felt dead. The torii camera had the same
shape, and so did the reveal system.

The rule: **if a user did it, paint it synchronously.** Use
`requestAnimationFrame` to throttle repeated events, never as the only path
to the screen.

```ts
const onMove = (e: PointerEvent) => {
  yaw += dx * 0.006;
  render(performance.now());   // paints directly, never waits for the loop
};
```

### Reveal animations must fail visible, not invisible

The scroll-reveal system hides elements and reveals them on intersection.
If the hiding is unconditional, then any JavaScript failure blanks the
entire site permanently.

The hidden state is therefore scoped to `.js`, which an inline head script
adds before first paint, and there is a hard override that forces content
visible:

```css
.js [data-reveal] { opacity: 0; }
.js [data-reveal].reveal-done { opacity: 1 !important; transform: none !important; }
```

Elements also reveal immediately when `document.hidden`, so a background tab
does not leave content blank when the reader returns.

### A backgrounded tab pauses rAF, which will lie to you during testing

Every animation in this project is frozen in a hidden tab. This repeatedly
made working code look broken and broken code look fine. When you test
motion, bring the tab to the foreground, or verify the logic directly
instead of observing pixels.

---

## 6. Open work

### Facts still missing, so ask Gotibeh and never guess

- The four program payment amounts: Jan 28, Feb 2, Feb 25, Mar 21, and
  possibly one more in April.
- The airport transfer fare.
- A roughly $1,000 discrepancy between charges and credits on the summer
  statement, currently unexplained.

These are all `status: 'todo'` in `facts.ts` and render as visible gaps.
That is correct behavior. Fill them with real numbers or leave them alone.

### Constraints that are not obvious from the code

- **Classmates' names stay off the site.** Gotibeh's approval covered their
  photographs, not their names. The itinerary spreadsheet lists twelve names
  in rooming pairs. None may be published.
- The itinerary shows twelve names but Gotibeh says ten students. Unresolved,
  so the group size is not stated anywhere on the site.
- Lori Sisk, the faculty leader, is credited by name, at Gotibeh's request.
- His personal airfare routing is deliberately omitted.

### Direction

The site is structurally complete and factually sound. What is left is
craft, in this order:

1. **Verify the motion in a real foreground tab.** The count-up on the five
   headline figures and the scroll progress bar were written and unit-tested
   but never observed running, because of the hidden-tab problem above.
2. **More life in the motion.** This is the explicit ask. Richer entrances,
   a globe that feels more alive on first load, cherry blossom petals that
   drift rather than fall straight. `Petals.astro` is the place to start.
3. **More photographs.** Gotibeh has a Google Drive "Japan Trip" folder not
   yet mined, and said he would add more.
4. **Ship it.** Push to GitHub, turn on Pages, and put the URL in front of
   Gilman.

Craft work is welcome and encouraged. **Factual work is not, unless the
fact comes from Gotibeh or a named public source.** That line does not move.

---

## 7. Verify you have not broken it

```bash
npm run build     # must pass — Zod validates every fact at import
npm run dev       # preview at /pell-to-planet/
```

A green build proves the facts are sourced. It does not prove the site
looks right. Also check, in a foreground tab:

- The globe drags, and still drags after it has stopped spinning.
- The torii gates approach as you scroll past them.
- Every photograph caption matches its photograph. Two were once swapped, so
  a teppanyaki dinner was labeled as a Mazda museum shot.
- Light and dark themes both hold contrast.
- Keyboard tab order reaches every interactive element.
- The footer still carries the required attribution. The Benjamin A. Gilman
  International Scholarship is a program of the U.S. Department of State
  with funding provided by the U.S. Government and supported in its
  implementation by the Institute of International Education.

That attribution is a program requirement. It is not optional and not
editorial.
