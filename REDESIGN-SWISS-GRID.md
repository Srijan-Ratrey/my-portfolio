# Redesign brief — Swiss grid, dark

Implementation spec for Claude Code. Written 2026-08-04.

**Read `PORTFOLIO-STATUS.txt` in this directory first.** It describes the stack,
the hosting setup, and a list of decisions that must not be undone. This document
assumes that context and does not repeat it.

---

## 0. The job in one paragraph

Replace the Bear Blog default styling with a Swiss / International Typographic
Style treatment: a strict grid, hard rules instead of cards, oversized grotesk
headings, tabular numerals for all data, zero border radius, and one signal
accent colour. **Dark only** — near-black page, no light mode, no
`prefers-color-scheme` branch. Along the way, fix three verified rendering bugs
(section 5).

Do not restructure the site. Same six routes, same content, same component
boundaries. This is a styling and typography change, plus the addition of a
figure component and a table wrapper.

---

## 1. Aesthetic rules

These are non-negotiable — they are what makes it Swiss rather than generically
dark.

- **No border radius anywhere.** `border-radius: 0` on images, code blocks,
  inputs, everything. The current `img { border-radius: 8px }` and
  `pre { border-radius: 8px }` both go.
- **No box shadows.** Delete `--box-shadow` and every use of it. Depth comes
  from rules and spacing, never from blur. The one exception is a focus ring.
- **No gradients.** The `--gray-gradient` on `body` goes.
- **Rules, not cards.** Sections are separated by `1px` or `2px` solid lines,
  not by bordered boxes with padding. A `2px` rule is a major division, `1px`
  is a minor one. Never both on the same edge.
- **Left-aligned everything.** Nothing is centred, including the blog post
  title block, which is currently `text-align: center` in `BlogPost.astro:43`.
- **Sentence case in the UI, uppercase for labels only.** Small metadata labels
  (`MACRO-F1`, `PROJECTS`, `AUG 2026`) are uppercase at 10–11px with
  `letter-spacing: 0.08em`. Headings and body are sentence case, never
  letter-spaced.
- **Two weights only: 400 and 500.** No 600, no 700. Swiss emphasis comes from
  size and position, not from weight. This means `strong, b { font-weight: 500 }`,
  replacing the current `700`.
- **Tight heading leading.** `line-height: 1.05` on h1, `1.15` on h2–h3. Body
  stays loose at `1.65`.
- **Negative tracking on large type.** `letter-spacing: -0.02em` on h1,
  `-0.015em` on h2. Zero on body.

---

## 2. Tokens

### The variable-format trap — read this before editing `global.css`

`global.css` currently defines colours as **comma-separated RGB triplets**
consumed via `rgb(var(--x))`:

```css
--black: 15, 18, 25;
--gray: 96, 115, 159;
```

Those variable names are referenced by `rgb(...)` / `rgba(...)` calls in
`index.astro`, `projects.astro`, `BlogPost.astro`, `Header.astro` and
`Footer.astro`. If you switch them to hex, every one of those call sites breaks
silently — `rgb(#0d0d0d)` is invalid, the declaration is dropped, and the
element inherits instead of erroring. The build stays green.

**Do it in this order:**

1. Add the new hex tokens alongside the old triplets.
2. Migrate every `rgb(var(--old))` / `rgba(var(--old), N%)` call site to the new
   hex tokens.
3. Only then delete the triplets.

Grep to confirm you got them all before deleting:

```bash
grep -rn "rgb(var(--\|rgba(var(--" src/
```

### Known pre-existing bug, fix it while you're in here

`Header.astro:48` reads `color: var(--black);` — not `rgb(var(--black))`. That
resolves to `color: 15, 18, 25`, which is invalid, so the declaration is dropped
and nav links fall back to inherited body colour. It has never worked. Set it
explicitly to `var(--text-primary)`.

### New palette

```css
:root {
  /* surfaces — 0 is the page, each step up is lighter */
  --surface-0: #0b0b0c;   /* page background */
  --surface-1: #141416;   /* inset panels, code blocks, figure frames */
  --surface-2: #1c1c1f;   /* hover states */

  /* text */
  --text-primary:   #f2f2f0;  /* headings, body */
  --text-secondary: #a3a3a0;  /* lede, detail copy, captions */
  --text-muted:     #6e6e6b;  /* metadata, labels, dates */

  /* rules */
  --rule-strong: #f2f2f0;  /* 2px major divisions — full-strength */
  --rule:        #2e2e31;  /* 1px minor divisions */

  /* accent — signal orange-red */
  --accent:       #ff6b35;
  --accent-hover: #ff8a5c;
  --accent-quiet: #7a2f14;  /* for a rule or underline, not for text */
}
```

**Do not use `#d84315`** — it was the mockup value and it only works on white.
On `#0b0b0c` it measures 4.4:1, below the 4.5:1 AA floor for body text.
`#ff6b35` measures 6.9:1. If you change the accent, check it against
`--surface-0` before committing.

Contrast for the record: `--text-primary` on `--surface-0` is 16.8:1,
`--text-secondary` is 7.4:1, `--text-muted` is 3.6:1 — muted is therefore
**metadata only**, never body copy, and never below 12px.

### Accent budget

The accent appears in at most four places per page. It is a signal, not a
theme colour:

1. Link text (all links, including in prose)
2. The active nav item's underline
3. One "hook" number per page — the `89.83%` accuracy trap, and nothing else
4. The left rule on a code block

Everything else is white, grey, or a rule. If you find yourself reaching for
orange a fifth time, use `--text-primary` at a larger size instead.

---

## 3. Type

### Typeface

Swiss needs a neutral grotesk. Atkinson Hyperlegible is a humanist accessibility
face and reads wrong here, but **leave the font files in place** — they're
already wired through Astro's font API and removing them is churn.

Add Inter alongside it via Astro's font provider in `astro.config.mjs`, weights
400 and 500 only:

```js
{
  provider: fontProviders.google(),
  name: 'Inter',
  cssVariable: '--font-inter',
  fallbacks: ['-apple-system', 'Helvetica Neue', 'Arial', 'sans-serif'],
  weights: [400, 500],
  styles: ['normal'],
  subsets: ['latin'],
}
```

Astro self-hosts this at build time, so there's no runtime Google Fonts request
and no privacy or CSP concern. Set `body { font-family: var(--font-inter) }`.

If the Inter fetch makes the build flaky in CI, drop the provider and use the
fallback stack alone — `-apple-system, "Helvetica Neue", Arial` gives you
Helvetica Neue on macOS and iOS, which is the actual Swiss reference face. Note
which option you shipped in the commit message.

Numerals and code use a mono stack — no webfont needed:

```css
--font-mono: ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, monospace;
```

### Scale

The current scale (`h1: 3.052em`, `h2: 2.441em`, `h3: 1.953em`) is the single
loudest tell that this is the Bear Blog default. Replace it.

| Element | Size | Weight | Leading | Tracking |
|---|---|---|---|---|
| `h1` (page title) | `clamp(2.2rem, 6vw, 3.4rem)` | 500 | 1.05 | -0.02em |
| `h2` | `1.6rem` | 500 | 1.15 | -0.015em |
| `h3` | `1.2rem` | 500 | 1.2 | -0.01em |
| `h4` | `1rem` | 500 | 1.3 | 0 |
| body | `17px` | 400 | 1.65 | 0 |
| lede / intro | `19px` | 400 | 1.55 | 0 |
| small / caption | `13px` | 400 | 1.5 | 0 |
| label (uppercase) | `11px` | 500 | 1.4 | 0.08em |

Body drops from 20px to 17px. That is deliberate — 20px is oversized for a
grotesk, and Swiss density depends on the type being smaller than the current
setting.

Mobile: the `clamp()` on h1 handles itself. Keep body at 17px on mobile too;
delete the current `@media (max-width: 720px) { body { font-size: 18px } }`
rule, it's no longer needed.

### Numerals

Every number in a data context gets tabular figures. Add this globally:

```css
table, .metric, .metrics, time, .stat {
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum' 1;
}
```

`font-feature-settings` is the belt-and-braces fallback for the system stack —
Helvetica Neue doesn't respond to `font-variant-numeric` alone on all versions.

---

## 4. Layout

### Grid

Define the measure once, in `global.css`:

```css
:root {
  --measure: 68ch;        /* prose column, ~640px at 17px */
  --page-max: 1100px;     /* wide container for grids and rules */
  --gutter: clamp(1rem, 4vw, 2.5rem);
}
```

`main` currently hardcodes `width: 720px`. Replace with `max-width:
var(--page-max)` and a left-aligned prose column of `var(--measure)` inside it.
Prose is never full-bleed; rules and grids are.

Full-bleed rules against a narrower text column is the core Swiss move here —
the horizontal line runs the width of the container while the paragraph stops
short. Don't let them share the same width.

### Header

Currently a white bar with a box shadow. Replace with:

- Background `var(--surface-0)` — same as the page, no distinct bar
- A `2px solid var(--rule-strong)` bottom border, full width
- Name on the left at 13px weight 500, uppercase, `letter-spacing: 0.08em`
- Nav on the right at 12px, uppercase, separated by `/` or by 1.5rem of space
- Active item: `2px solid var(--accent)` bottom border, sitting on the header's
  own rule (`margin-bottom: -2px`) so it reads as a tab, not a floating
  underline. The existing `border-bottom: 4px solid transparent` becomes `2px`.
- Drop the `box-shadow` entirely
- The GitHub icon SVG stays. It currently renders at `width="32"` — reduce to
  20px and set `color: var(--text-muted)`, `--accent` on hover. Keep the
  `.sr-only` label.
- **Keep** the `@media (max-width: 720px) { .social-links { display: none } }`
  rule, or better, keep the icon and drop the nav labels to icons. Your call —
  hiding the only external link on mobile is a small loss.

### Footer

Currently a grey gradient, centred. Make it: `1px solid var(--rule)` top border,
left-aligned, 12px `var(--text-muted)`, generous top margin (`4rem`). No
gradient, no centring.

### Home page (`index.astro`)

Add a metric row under the intro — this is the one element borrowed from
direction 7, and it is the highest-value addition on the page. Three or four
stats, each a left-border cell:

```html
<div class="metrics">
  <div class="metric">
    <span class="metric-label">MACRO-F1</span>
    <span class="metric-value">0.684</span>
  </div>
  <!-- … -->
</div>
```

```css
.metrics { display: flex; flex-wrap: wrap; gap: 1.5rem; margin: 2.5rem 0; }
.metric { border-left: 2px solid var(--rule-strong); padding-left: 0.75rem; }
.metric-label { display: block; font-size: 11px; font-weight: 500;
  letter-spacing: 0.08em; color: var(--text-muted); }
.metric-value { display: block; font-size: 1.75rem; font-weight: 500;
  font-variant-numeric: tabular-nums; color: var(--text-primary); }
.metric-value.is-trap { color: var(--accent); }
```

Note the `border-left` has no radius — per the aesthetic rules, single-sided
borders and rounded corners never mix.

**Only use real numbers.** The three metrics I'd use are all verifiable from the
existing content: `MACRO-F1 0.684`, `ACCURACY TRAP 89.83%` (accent), `N TEST
23,936`. Do not invent metrics for the RAG, NL2SQL or JobHunter projects — there
are no published figures for those in the repo, and a fabricated number on a
portfolio is worse than no number.

The existing `.recent` post list already uses a flex row with a bottom border,
which is close to correct. Change the border to `var(--rule)`, make the date
`var(--text-muted)` at 12px uppercase, and add a hover state that shifts the
title to `var(--accent)`.

### Projects page (`projects.astro`)

The structure is already right — a `<ul>` of `<li>` separated by bottom borders.
Restyle rather than rebuild:

- `.project` bottom border becomes `1px solid var(--rule)`; first child gets a
  `2px solid var(--rule-strong)` top border
- Number each project. Add an `NN` index in `var(--text-muted)` mono at 11px
  above the title — `01`, `02`, `03`, `04`. Use the `map` index, and pad with
  `String(i + 1).padStart(2, '0')`.
- `.project h2` goes to `1.6rem` weight 500 with `-0.015em` tracking
- **`ul.stack` chips lose their pills.** `border-radius: 999px` violates the
  aesthetic rules. Replace with `1px solid var(--rule)`, square corners, 11px
  uppercase `var(--text-secondary)`, transparent background, `0.2em 0.6em`
  padding.
- `.links` anchors get the accent, and the existing ` ↗` / ` →` suffixes stay —
  they're a nice touch and they're already correct.
- Consider a two-column grid at `>900px`: `grid-template-columns: repeat(2,
  minmax(0, 1fr))` with a `1px` vertical rule via `column-gap` plus borders. Use
  `minmax(0, 1fr)`, not `1fr` — with `1fr` the long `detail` strings push the
  column past its track.

### Blog post (`BlogPost.astro`)

- `.title` loses `text-align: center` — left-align it
- `.hero-image img` loses `border-radius: 12px` and `box-shadow`
- Move the date **below** the h1 as a `var(--text-muted)` uppercase 11px line,
  and put a `2px solid var(--rule-strong)` rule under the whole title block,
  replacing the current `<hr />`
- `.prose` width becomes `var(--measure)`, left-aligned within `--page-max`,
  not `margin: auto`
- Add a table of contents. The post has ~8 h2 sections and is long enough that
  section 9 of `PORTFOLIO-STATUS.txt` flags this as a gap. A simple approach:
  read `headings` from `render()` in `blog/[...slug].astro`, pass them to the
  layout, and render an ordered list under the title rule. Filter to `depth === 2`.

---

## 5. The three rendering fixes

From section 6 of `PORTFOLIO-STATUS.txt`. These are verified bugs, not
preferences, and they are the reason the redesign is worth doing at all. **Land
these even if you run out of time for the rest.**

### (a) Wide tables break on mobile

`global.css:86` sets `table { width: 100% }` with no overflow wrapper anywhere.
The post's per-label table is 7 columns; on a phone it is crushed unreadable.

Markdown doesn't let you wrap the generated `<table>`, so use one of:

**Option 1, CSS only (do this first, it's one rule):**

```css
.prose table { display: block; overflow-x: auto; max-width: 100%;
  white-space: nowrap; }
```

`display: block` on a table is a real tradeoff — it drops
`table-layout` semantics and the element no longer stretches to fill. Acceptable
here, and it is by far the smallest change.

**Option 2, a rehype plugin (do this if option 1 looks wrong):**

Add `rehype-wrap-tables`-style behaviour — a small local plugin that wraps every
`table` node in `<div class="table-scroll">`, registered under
`markdown.rehypePlugins` in `astro.config.mjs`. Then the overflow lives on the
wrapper and the table keeps its own display semantics. Preferred outcome, more
moving parts.

Either way, style the table itself:

```css
.prose table { border-collapse: collapse; font-size: 14px;
  font-variant-numeric: tabular-nums; }
.prose th { text-align: left; font-weight: 500; font-size: 11px;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--text-muted); border-bottom: 1px solid var(--rule); padding: 0.5rem 1rem 0.5rem 0; }
.prose td { border-bottom: 1px solid var(--rule); padding: 0.5rem 1rem 0.5rem 0; }
.prose thead { border-top: 2px solid var(--rule-strong); }
.prose td:not(:first-child), .prose th:not(:first-child) { text-align: right; }
```

Right-aligning every column but the first is what makes a metrics table
readable — decimal points line up. This is the highest-impact single rule in
this document.

Add a scroll affordance so it's discoverable, not just possible: a
`1px solid var(--rule)` right edge on the wrapper, or a `↔` hint above the table
on `max-width: 700px`.

### (b) Code blocks were dark islands on a white page

**This one dissolves.** Shiki is already on `github-dark`, and the page is now
dark, so the mismatch is gone. Keep the theme. Two adjustments:

```css
pre { border-radius: 0; border-left: 2px solid var(--accent);
  background: var(--surface-1); padding: 1rem 1.25rem; }
code { border-radius: 0; background: var(--surface-1);
  color: var(--text-primary); font-size: 0.9em; padding: 0.1em 0.35em; }
```

Verify Shiki's own background matches `--surface-1` closely enough not to seam.
`github-dark` renders on `#24292e`, which is lighter and bluer than `#141416`.
Either set `--surface-1: #24292e` to match Shiki, or override Shiki's background
in CSS. Matching `--surface-1` to Shiki is less work and less fragile — do that
and adjust the other surfaces to sit around it.

### (c) Dark mode plus four white-background charts

**This is now the main risk of the whole job, because you chose dark-only.**

The four PNGs in `public/jigsaw/` are matplotlib exports with opaque white
backgrounds — `pr_baseline.png` is 1522×756, `eda_cooccurrence.png` is 1463×532.
On a `#0b0b0c` page they are four glaring white rectangles.

**Do not use `filter: invert()`.** It destroys the colour-coded curves in the PR
plot and inverts the co-occurrence heatmap's meaning.

Ship the CSS solution now:

```css
.prose img { border-radius: 0; background: #fff; padding: 1rem;
  border: 1px solid var(--rule); display: block; }
figure { margin: 2.5rem 0; }
figcaption { font-size: 12px; color: var(--text-muted); margin-top: 0.5rem;
  border-top: 1px solid var(--rule); padding-top: 0.5rem; }
```

A white chart inside an explicit white plate with a bordered frame and a caption
reads as an intentional inset — the same convention print uses for a plate on a
dark page. Add `FIGURE N —` prefixes to the captions; they fit the Swiss idiom
and the post already refers to its charts in the prose.

Markdown images won't produce `<figure>` on their own. Either convert the four
image references in
`src/content/blog/multi-label-content-classification.md` to explicit HTML
`<figure>` blocks (markdown allows raw HTML, and there are only four), or add a
rehype plugin that promotes a lone image in a paragraph to a figure using its
alt text as the caption. Four hand-written figures is less clever and more
predictable — prefer it.

**The real fix, if you want it later:** re-export the charts from the source repo
(`~/Documents/text-classifier`, `results/*.png`) with
`savefig(..., transparent=True)` and light stroke/tick colours. Then they sit
natively on the dark page with no plate. That's a change in the other repo, out
of scope here, and section 9 of the status doc already lists it.

---

## 6. Accessibility floor

Dark themes fail contrast quietly, so check rather than assume.

- Body text is `--text-primary` on `--surface-0` at 16.8:1. Fine.
- `--text-muted` is 3.6:1 — **metadata only**, minimum 12px, never a paragraph.
- Links are `--accent` at 6.9:1. Fine at body size.
- Links in prose must not rely on colour alone. Add
  `text-decoration: underline; text-underline-offset: 0.2em;` and reserve
  colour-only links for nav and metric callouts, which are structurally obvious.
- Add a visible focus ring — the only permitted box shadow:
  `:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }`
- Keep the existing `.sr-only` class in `global.css` exactly as is. It's correct
  and both icon links depend on it.
- Set `<meta name="color-scheme" content="dark">` in `BaseHead.astro` so form
  controls and scrollbars render dark, and the browser doesn't flash white on
  first paint.

---

## 7. Do not touch

Repeated from section 8 of `PORTFOLIO-STATUS.txt` because these are easy to
break while restyling:

- **No SSR adapter.** Static output only.
- **`site` in `astro.config.mjs`** stays `https://srijan-ratrey.sr5.workers.dev`.
  If you touch it, the RSS feed, sitemap and canonicals silently go wrong while
  the build stays green.
- **The commented-out Streamlit link** in `projects.astro` stays commented.
- **`BaseHead.astro`'s conditional `og:image`.** Don't reintroduce an
  unconditional fallback — the asset it pointed at was deleted.
- **`heroImage` must stay under `src/assets/`**; post images stay in `public/`
  with absolute paths.
- **The blog frontmatter schema** in `content.config.ts`. A mismatch fails the
  build.
- **`wrangler.jsonc`.** Nothing in this job touches hosting.

---

## 8. Suggested commit sequence

Small commits, each independently revertable, so a bad type scale doesn't take
the table fix down with it.

1. `fix: wrap wide tables, tabular numerals, right-align numeric columns` — section 5(a), shippable alone
2. `feat: dark Swiss tokens, replace RGB triplets with hex` — section 2, including the `Header.astro:48` fix
3. `feat: Inter, new type scale` — section 3
4. `feat: restyle header, footer, home metric row` — section 4
5. `feat: restyle projects page, numbered entries, square chips` — section 4
6. `feat: post layout, left-aligned title, figure plates, TOC` — sections 4 and 5(c)

---

## 9. Acceptance criteria

Build and structural:

```bash
npm run build     # exits 0, 6 pages
npm run preview   # this is what Cloudflare serves
grep -rn "rgb(var(--\|rgba(var(--" src/   # empty once step 2 is done
grep -rn "border-radius" src/             # only 0 values, or nothing
grep -rn "box-shadow" src/                # only the focus ring
grep -rn "prefers-color-scheme" src/      # empty — dark only, by decision
```

`site` unchanged:

```bash
grep -o '<link>[^<]*</link>' dist/rss.xml | head -2   # srijan-ratrey.sr5.workers.dev
```

By eye, at 375px wide and at 1440px:

- [ ] The 7-column per-label table scrolls horizontally and is readable. Decimal points line up.
- [ ] All four charts in the post sit on white plates with `FIGURE N` captions. No white rectangle bleeds to the page edge.
- [ ] Code blocks have no seam between Shiki's background and the surrounding panel.
- [ ] Nothing has a rounded corner. Nothing has a shadow except a focused control.
- [ ] The accent appears at most four times per page.
- [ ] Metric numbers on the home page are real — `0.684`, `89.83%`, `23,936` — and nothing is invented.
- [ ] Prose column is narrower than the rules that divide it.
- [ ] Post title is left-aligned.
- [ ] Tab through the header: every link shows a visible orange focus ring.
- [ ] No white flash on first paint (`color-scheme: dark` is set).

Live, after deploy:

```bash
BASE=https://srijan-ratrey.sr5.workers.dev
for p in / /projects /blog/ /about /blog/multi-label-content-classification/ \
         /rss.xml /sitemap-index.xml; do
  echo "$(curl -s -o /dev/null -w '%{http_code}' -L "$BASE$p")  $p"
done
```

`/blog` returning 307 to `/blog/` is normal Astro trailing-slash behaviour on
Workers, not a regression.

---

## 10. Open questions for whoever implements this

Decide and note the answer in the commit message rather than guessing silently.

1. **Inter via Google provider, or the system Helvetica stack?** Section 3 has
   the tradeoff. Either is defensible; the system stack is more robust.
2. **Table overflow via CSS or a rehype plugin?** Section 5(a). Start with CSS.
3. **Two-column projects grid above 900px, or stay single-column?** Single is
   safer with these long `detail` strings.
4. **Hide the GitHub icon on mobile, or keep it and shrink the nav?** Currently
   hidden, which loses the only outbound link on a phone.
